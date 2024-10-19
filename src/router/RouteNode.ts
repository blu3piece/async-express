import { MiddlewareFunction } from "@/app";
import { HTTPMethodType } from "@/http";
import { Request } from "@/http";

export interface RouteProps {
    method: HTTPMethodType;
    wordList: string[];
    handler: MiddlewareFunction;
}

export class RouteNode {
    private staticRoutes: Record<string, RouteNode> = {};
    private dynamicRoutes: Record<string, RouteNode> = {};
    private handler: MiddlewareFunction[] | null = null;

    attachRoute(wordList: string[], ...handlers: MiddlewareFunction[]) {
        if (wordList.length === 0) {
            this.setHandler(handlers.length === 0 ? null : handlers);
            return this;
        }

        const [word, ...nextWordList] = wordList;
        const childRoute = new RouteNode().attachRoute(nextWordList, ...handlers);

        // TODO: 중첩 if문 로직 개선
        if (word.startsWith(":")) {
            if (this.dynamicRoutes[word.slice(1)]) this.dynamicRoutes[word.slice(1)].composite(childRoute);
            else this.dynamicRoutes[word.slice(1)] = childRoute;
        }
        else {
            if (this.staticRoutes[word]) this.staticRoutes[word].composite(childRoute);
            else this.staticRoutes[word] = childRoute;
        }

        return this;
    }

    private setHandler(handler: MiddlewareFunction[] | null) {
        this.handler = handler;
    }

    getHandler() {
        return this.handler;
    }

    // TODO: 동적 라우트가 되었을 때, 올바르게 파싱하여 request 객체에 담기
    findRoute(req: Request, wordList: string[]): RouteNode | null {
        if (wordList.length === 0) {
            return this;
        }

        const [word, ...nextWordList] = wordList;
        const exactMatch = this.staticRoutes[word];

        if (exactMatch) {
            return exactMatch.findRoute(req, nextWordList);
        }

        for (const [item, routeNode] of Object.entries(this.dynamicRoutes)) {
            const result = routeNode.findRoute(req, nextWordList);
            if (result) {
                req.setParam(item, word);
                return result;
            }
        }

        return null;
    }

    composite(routeNode: RouteNode) {
        for (const [word, childNode] of Object.entries(routeNode.staticRoutes)) {
            if(this.staticRoutes[word]) this.staticRoutes[word].composite(childNode);
            else this.staticRoutes[word] = childNode;
        }

        for (const [word, childNode] of Object.entries(routeNode.dynamicRoutes)) {
            if(this.dynamicRoutes[word]) this.dynamicRoutes[word].composite(childNode);
            else this.dynamicRoutes[word] = childNode;
        }

        if (routeNode.getHandler()) {
            this.setHandler(routeNode.getHandler());
        }
    }
}
