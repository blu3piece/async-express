import path from "path";
import {HTMLNode} from "./HTMLTag";
import {TemplateEngine} from "./TemplateEngine";
import {StaticFileHandler} from "../app/staticFileHandler";

export class EJSTemplateEngine extends TemplateEngine {
    staticFileHandler: StaticFileHandler;

    constructor(staticFileHandler: StaticFileHandler) {
        super();
        this.staticFileHandler = staticFileHandler;
    }

    render(fileName: string, htmlString: string[]): string {
        const template = this.staticFileHandler.getStaticFile(fileName);

        return "";
    }
}