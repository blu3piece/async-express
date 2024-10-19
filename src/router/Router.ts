import { Request, Response } from "@/http";
import { MiddlewareFunction } from "@/app";
import { HTTPMethodType } from "@/http";
import { RouteNode } from "./RouteNode";

export class Router {
    routes: Record<HTTPMethodType, RouteNode> = {
        GET: new RouteNode(),
        POST: new RouteNode(),
        PUT: new RouteNode(),
        DELETE: new RouteNode(),
    };

    splitPath(path: string) {
        return path.split("/").filter((v) => v !== "");
    }

    get(path: string, ...handlers: MiddlewareFunction[]) {
        const wordList = this.splitPath(path);
        this.routes.GET.attachRoute(wordList, ...handlers);
    }

    post(path: string, ...handlers: MiddlewareFunction[]) {
        const wordList = this.splitPath(path);
        this.routes.POST.attachRoute(wordList, ...handlers);
    }

    put(path: string, ...handlers: MiddlewareFunction[]) {
        const wordList = this.splitPath(path);
        this.routes.PUT.attachRoute(wordList, ...handlers);
    }

    delete(path: string, ...handlers: MiddlewareFunction[]) {
        const wordList = this.splitPath(path);
        this.routes.DELETE.attachRoute(wordList, ...handlers);
    }

    async route(req: Request, res: Response) {
        if (!req.path) throw new Error("wrong request : wrong path name");

        const wordList = this.splitPath(req.path);
        const route = this.routes[req.method].findRoute(req, wordList);

        const handlers = route?.getHandler();
        if (!handlers) return;

        for (let i=0; i < handlers.length; ++i) {
            if (res.getHasSent()) return;

            const handler = handlers[i];
            await handler(req, res);
        }
    }

    composite(router: Router) {
        this.routes.GET.composite(router.routes.GET);
        this.routes.POST.composite(router.routes.POST);
        this.routes.PUT.composite(router.routes.PUT);
        this.routes.DELETE.composite(router.routes.DELETE);
    }
}
