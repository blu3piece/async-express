import url from "url";
import { HTTPMethodType } from "./HTTP";
import {ParsedUrlQuery} from "node:querystring";
import {BadRequestError} from "./exceptions";

export class Request {
    private header: Record<string, string> = {};
    private _body: string = "";
    readonly method: HTTPMethodType;
    readonly uri: string;
    readonly path: string;
    readonly version: string;
    public query: ParsedUrlQuery = {};
    public param: Record<string, string> = {};

    constructor(data: string) {
        const [method, uri, version] = data.split("\r\n")[0].split(" ");

        this.method = method as HTTPMethodType;
        this.uri = uri;

        const { pathname, query } = url.parse(this.uri, true);
        this.path = pathname ?? "";
        this.query = query ?? {};
        this.version = version;

        this.parseMainContent(data);
    }

    public setParam(item:string, value:string) {
        this.param[item] = value;
    }

    private parseMainContent(data: string) {
        const lines = data.split("\r\n");
        let isBody = false;
        for (let i = 1; i < lines.length; i++) {
            if (lines[i].length === 0) {
                isBody = true;
                continue;
            }

            if (!isBody) {
                const tokens = lines[i].split(/:\s*(.*)/, 2);
                this.header[tokens[0]] = tokens[1];
            } else {
                this._body += `${lines[i]}\r\n`;
            }
        }
    }

    public getHeader(key: string): string | undefined {
        return this.header[key];
    }

    public getCookie() {
        const cookieObj: Record<string, string> = {};
        const cookieStr = this.getHeader("Cookie");

        if (typeof cookieStr !== "string") return {};

        cookieStr.split(/;\s*/g).filter(s => s.length !== 0).forEach(prop => {
            const [key, value] = prop.split(/=(.+)/);

            if (!(key.length > 0 && value.length > 0)) throw new BadRequestError();

            cookieObj[key] = value;
        });

        return cookieObj;
    }

    public getBody() {
        return this._body;
    }
}
