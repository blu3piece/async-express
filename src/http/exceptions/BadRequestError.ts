import {HTTPError} from "./HTTPError";
import {STATUS_CODE} from "../HTTP";

export class BadRequestError extends HTTPError {
    statusCode = STATUS_CODE.BAD_REQUEST;
}