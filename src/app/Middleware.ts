import { Request, Response } from "../http";

export type MiddlewareFunction = (req: Request, res: Response) => Promise<void> | void;
export type ErrorHandler = (req: Request, res: Response, err: Error) => Promise<void> | void;

export class Middleware {
    private middlewares: MiddlewareFunction[] = [];
    private errorHandler: ErrorHandler[] = [];

    constructor() {}

    add(middleware: MiddlewareFunction | ErrorHandler) {
        if(middleware.length === 2) this.middlewares.push(middleware as MiddlewareFunction);
        else this.errorHandler.push(middleware);
    }

    async execute(req: Request, res: Response) {
        try {
            await this.executeMiddleware(req, res);
        }
        catch (err) {
            await this.executeErrorHandler(req, res, err as Error);
        }
    }

    async executeMiddleware(req: Request, res: Response) {
        for (let index = 0; index < this.middlewares.length && !res.getHasSent(); index++) {
            const middleware = this.middlewares[index];
            await middleware(req, res);
        }
    }

    // 두번 반복까지는 그냥 중복으로 놔두어도 괜찮지 않을까
    async executeErrorHandler(req: Request, res: Response, err: Error) {
        let index = 0;

        if (this.errorHandler.length === 0) throw err;

        const next = async (req: Request, res: Response, err: Error) => {
            if (index >= this.middlewares.length || res.getHasSent()) return;

            try {
                await this.errorHandler[index](req, res, err);

                index++;
                next(req, res, err);
            }
            catch (err) {
                index++;
                next(req, res, err as Error); // 기다리지 않고 끝내는 방식으로 작업 큐 최적화
            }
        };

        next(req, res, err);
    }
}
