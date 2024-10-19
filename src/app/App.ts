import net from "net";
import {ErrorHandler, Middleware, MiddlewareFunction} from "./Middleware";
import {Request, Response } from "@/http";
import {Router} from "@/router";
import {logger} from "@/logger";
import {StaticFileHandler} from "./staticFileHandler";
import {JTHTemplateEngine} from "@/templateEngine/JTHTemplateEngine";
import {Logger} from "winston";

type Usable = MiddlewareFunction | ErrorHandler | Router;

export class App {
    private socketMap: Map<net.Socket, NodeJS.Timeout> = new Map();
    private server: net.Server;
    private middleware: Middleware;
    private router: Router;
    private logger: Logger = logger;
    private hasRoute: boolean = false;
    private viewEngine?: JTHTemplateEngine;
    private staticFileHandler?: StaticFileHandler;

    constructor() {
        this.server = net.createServer(this.socketHandler.bind(this));
        this.middleware = new Middleware();
        this.router = new Router();
    }

    private socketHandler(socket: net.Socket) {
        socket.on("data", async (chunk: Buffer) => {
            if(this.socketMap.has(socket)) {
                clearTimeout(this.socketMap.get(socket));
            }

            const request = new Request(chunk.toString());

            const socketWriteCallback = (err: Error | undefined) => {
                if (err) {
                    console.error("Error writing to socket:", err);
                    if(!socket.destroyed) socket.destroy(err);
                }

                this.socketMap.set(socket, setTimeout(() => {
                    // console.log(`연결 종료 : ${socket.remoteAddress}:${socket.remotePort}`);
                    socket.end();
                    this.socketMap.delete(socket);
                }, parseInt(request.getHeader("Keep-Alive") ?? "5000")));
            };

            const response = new Response({
                staticFileHandler:this.staticFileHandler,
                viewEngine: this.viewEngine
            });

            await this.middleware.execute(request, response);

            const headerBuffer = response.getHeaderBuffer();
            const bodyBuffer = response.getBody();

            if (bodyBuffer) socket.write(Buffer.concat([headerBuffer, bodyBuffer]), socketWriteCallback);
            else socket.write(headerBuffer, socketWriteCallback);

            const responseType = Math.floor(response.getStatus() / 100);

            switch (responseType) {
                case 2:
                    this.logger.info(`${request.method} ${request.uri} ${response.getStatus()}`);
                    break;
                case 3:
                    this.logger.info(`${request.method} ${request.uri} ${response.getStatus()}`);
                    break;
                case 4:
                    this.logger.warn(`${request.method} ${request.uri} ${response.getStatus()}`);
                    break;
                default:
                    this.logger.error(`${request.method} ${request.uri} ${response.getStatus()}`);
            }
        });

        socket.on("error", (error: Error) => {
            console.error("Socket Error:", error);
            if(!socket.destroyed) socket.destroy(error);
        });
    }

    use(arg: Usable) {
        if (arg instanceof Router) {
            this.router.composite(arg);
            if (!this.hasRoute) {
                this.middleware.add(this.routerMiddleware.bind(this));
                this.hasRoute = true;
            }
            return;
        }

        this.middleware.add(arg);
    }

    setStaticPath(path: string) {
        this.staticFileHandler = new StaticFileHandler(path, this.logger);
        this.use(this.staticFileHandler.getMiddleware());
    }

    setViewEngine(viewEngine: JTHTemplateEngine) {
        this.viewEngine = viewEngine;
    }

    setLogger(logger: Logger) {
        this.logger = logger;
    }

    private async routerMiddleware(req: Request, res: Response) {
        await this.router.route(req, res);
    }

    listen(port: number, startHandler: () => void) {
        this.server.listen(port, startHandler);
    }
}
