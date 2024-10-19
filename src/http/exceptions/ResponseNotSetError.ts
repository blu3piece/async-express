import {HTTPError} from "./HTTPError";
import {STATUS_CODE} from "../HTTP";

export class ResponseNotSetError extends HTTPError {
    statusCode = STATUS_CODE.INTERNAL_SERVER_ERROR;
    message: string = "응답에 필요한 데이터가 설정되어 있지 않습니다.";
}

export class ViewEngineNotSetError extends ResponseNotSetError {
    message = "뷰 엔진이 설정되어 있지 않습니다.";
}

export class StaticFileHandlerNotSetError extends ResponseNotSetError {
    message = "정적 파일 경로가 설정되어 있지 않습니다.";
}