import {HTTPStatusCodeType, STATUS_CODE, STATUS_MESSAGE} from "./HTTP";
import {HTMLNode} from "../templateEngine/HTMLTag";
import {StaticFileHandler} from "../app/staticFileHandler";
import {JTHTemplateEngine} from "../templateEngine/JTHTemplateEngine";
import {ViewEngineNotSetError} from "./exceptions/ResponseNotSetError";

export type Sendable = Buffer | object | string;

export class Response {
    private readonly version: string;
    private status: HTTPStatusCodeType;
    private header: Record<string, string> = {};
    private body: Buffer | null = null;
    private hasSent: boolean = false;
    private readonly staticFileHandler: StaticFileHandler | null = null;
    private readonly viewEngine: JTHTemplateEngine | null = null;
    private cookieData: Record<string, string> = {};

    constructor({staticFileHandler, viewEngine}: {
        staticFileHandler?: StaticFileHandler,
        viewEngine?: JTHTemplateEngine
    }) {
        this.version = "HTTP/1.1";
        this.status = STATUS_CODE.SUCCESS;
        if (staticFileHandler) this.staticFileHandler = staticFileHandler;
        if (viewEngine) this.viewEngine = viewEngine;
    }

    getHeaderBuffer() {
        if (!this.status) throw new Error("status is undefined");

        let returnValue = "";

        for (const [key, value] of Object.entries(this.header)) {
            returnValue += `${key}: ${value}\r\n`;
        }

        let setCookieString = "";

        for (const [key, value] of Object.entries(this.cookieData)) {
            setCookieString += `${key}=${value};`;
        }

        if (setCookieString.length > 0) returnValue += `Set-Cookie: ${setCookieString}; Path=/\r\n`;

        if (this.body) returnValue += `Content-Length: ${this.body.byteLength}\r\n`;
        else returnValue += `Content-Length: 0\r\n`;

        return Buffer.from(`${this.version} ${this.status} ${
            STATUS_MESSAGE[this.status]
        }\r\n${returnValue}\r\n`);
    }

    getBody() {
        return this.body;
    }

    getHasSent() {
        return this.hasSent;
    }

    getStatus() {
        return this.status;
    }

    setHeader(key: string, value: string) {
        this.header[key] = value;
        return this;
    }

    setCookie(key: string, value: string) {
        this.cookieData[key] = value;
        return this;
    }

    setBody(body: Buffer | string) {
        this.body = body instanceof Buffer ? body : Buffer.from(body);
    }

    setStatus(status: HTTPStatusCodeType) {
        this.status = status;
        return this;
    }

    send(body?: Sendable) {
        if (this.hasSent) {
            throw new Error("Response has already been sent");
        }
        this.hasSent = true;

        if(!body) {
            this.setBody(STATUS_MESSAGE[this.status]);
            return;
        }

        if (body instanceof Buffer) {
            this.setBody(body);
            return;
        }

        if(typeof body === "object" && !this.header["Content-Type"]) this.setHeader("Content-Type", "application/json");
        const serializedBody = typeof body === "object" ? JSON.stringify(body) : body;

        this.setBody(serializedBody);
    }

    sendFile(filePath: string) {
        if (!this.staticFileHandler) throw new Error("Response has already been sent");

        const fileContent = this.staticFileHandler.getStaticFile(filePath);

        if (fileContent) {
            this.setStatus(STATUS_CODE.SUCCESS)
                .setHeader("Content-Type", fileContent.contentType)
                .send(fileContent.buffer);

            return;
        }

        this.setStatus(404).send("File not found");
    }
    
    render(target: HTMLNode) {
        if (!this.viewEngine) throw new ViewEngineNotSetError();

        console.log(this.viewEngine?.render(target));

        this.setHeader("Content-Type", "text/html")
            .setStatus(STATUS_CODE.SUCCESS)
            .send(this.viewEngine?.render(target));
    }
}
