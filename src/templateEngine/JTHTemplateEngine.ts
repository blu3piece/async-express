import {HTMLNode} from "./HTMLTag";
import {TemplateEngine} from "./TemplateEngine";

export class JTHTemplateEngine extends TemplateEngine {
    render(target: HTMLNode): string {
        return `<${target.tag} ${target.property ?? ""}>
            ${target.children ? target.children
            .reduce((acc, child) => acc + (typeof child !== "string" ? this.render(child) : child), "") : ""}
        </${target.tag}>`;
    }
}