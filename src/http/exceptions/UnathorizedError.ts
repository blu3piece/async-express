import {HTTPError} from "./HTTPError";
import {STATUS_CODE} from "../HTTP";

export class UnauthorizedError extends HTTPError {
    statusCode = STATUS_CODE.UNAUTHORIZED;
}