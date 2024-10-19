import {HTTPError} from "./HTTPError";
import {STATUS_CODE} from "../HTTP";
import {Response, Request} from "../../index";

export class NotFoundError extends HTTPError {
    statusCode = STATUS_CODE.NOT_FOUND;

    handler(req: Request, res: Response, err: Error) {
        res.setStatus(this.statusCode).sendFile("notfound.html");
    }
}