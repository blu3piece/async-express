import { Request, Response } from "../index";
import path from "path";
import fs from "fs";
import {NotFoundError} from "../http/exceptions/NotFoundError";
import {JTHTemplateEngine} from "../templateEngine/JTHTemplateEngine";
import {BadRequestError} from "../http/exceptions/BadRequestError";
import {Logger} from "winston";

const EXT_LIST = Object.freeze({
    HTML: ".html",
    CSS: ".css",
    JS: ".js",
    ICO: ".ico",
    PNG: ".png",
    JPG: ".jpg",
});

const EXT_CONTENT_TYPE = Object.freeze({
    [EXT_LIST.HTML]: "text/html",
    [EXT_LIST.CSS]: "text/css",
    [EXT_LIST.JS]: "text/javascript",
    [EXT_LIST.ICO]: "image/x-icon",
    [EXT_LIST.PNG]: "image/png",
    [EXT_LIST.JPG]: "image/jpeg",
});

type ExtContentType = keyof typeof EXT_CONTENT_TYPE;

// NOTE: view 엔진과, staticPath 를 매번 함수 인자로 넘겨주고받는게 불편해져서 이제 클래스로 사용
/**
 * StaticFileHandler 를 싱글턴 인스턴스로써 사용
 * Response 에 기본 StaticFileHandler 로 사용됨
 */
export class StaticFileHandler {
    constructor(
        private readonly staticPath: string,
        private readonly logger: Logger
    ) {}

    getStaticPath() {
        return this.staticPath;
    }

    getMiddleware() {
        return this.middleware.bind(this);
    }

    private middleware(req: Request, res: Response) {
        const fileContent = this.getStaticFile(req.path);

        if (fileContent) {
            res.setStatus(200)
                .setHeader("Content-Type", fileContent.contentType)
                .send(fileContent.buffer);
        }
    }

    public getStaticFile(uri: string) {
        const words = this.parseFilePath(uri);
        const extname = uri.match(/\.([^.]+)$/g);

        if (extname && Object.values(EXT_LIST).find(ext => ext === extname[0])) {

            const filePath = path.join(this.staticPath, ...words);

            try {
                const fileContent = fs.readFileSync(filePath);

                return {
                    contentType: EXT_CONTENT_TYPE[extname[0] as ExtContentType],
                    buffer: fileContent,
                };
            } catch (e) {
                this.logger.error(e);
                throw new NotFoundError();
            }
        }
    }

    private parseFilePath(filePath: string) {
        const pathArray = filePath.split(/\//g);

        pathArray.forEach((word) => {
            if (word === "..") throw new BadRequestError();
        });

        return pathArray;
    }
}