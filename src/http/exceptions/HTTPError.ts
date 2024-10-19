import {HTTPStatusCodeType, Request, Response, Sendable, STATUS_CODE} from "../../index";

// TODO: 해당 에러는 HTTP 에러로, HTTP 파싱 모듈 안에 들어가야할까? 어디에 있어야할까?
export class HTTPError extends Error {
    statusCode: HTTPStatusCodeType = STATUS_CODE.INTERNAL_SERVER_ERROR;
    message = "잘못된 HTTP 요청입니다.";
    private body?: Sendable;

    buildBody(data: Sendable) {
        this.body = data;
        return this;
    }

    handler(req:Request, res:Response, err: Error) {
        res.setStatus(this.statusCode).send(this.body);
    };
}