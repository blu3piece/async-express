export const STATUS_CODE = {
    SUCCESS: 200,
    BAD_REQUEST: 400,
    NOT_FOUND: 404,
    FOUND: 302,
    INTERNAL_SERVER_ERROR: 500,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,
    MOVED_PERMANENTLY: 301,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    METHOD_NOT_ALLOWED: 405,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    TOO_MANY_REQUESTS: 429,
    SERVICE_UNAVAILABLE: 503,
} as const;

export const STATUS_MESSAGE = {
    [STATUS_CODE.SUCCESS]: "Success",
    [STATUS_CODE.BAD_REQUEST]: "Bad Request",
    [STATUS_CODE.NOT_FOUND]: "Not Found",
    [STATUS_CODE.FOUND]: "Found",
    [STATUS_CODE.INTERNAL_SERVER_ERROR]: "Internal Server Error",
    [STATUS_CODE.CREATED]: "Created",
    [STATUS_CODE.ACCEPTED]: "Accepted",
    [STATUS_CODE.NO_CONTENT]: "No Content",
    [STATUS_CODE.MOVED_PERMANENTLY]: "Moved Permanently",
    [STATUS_CODE.UNAUTHORIZED]: "Unauthorized",
    [STATUS_CODE.FORBIDDEN]: "Forbidden",
    [STATUS_CODE.METHOD_NOT_ALLOWED]: "Method Not Allowed",
    [STATUS_CODE.CONFLICT]: "Conflict",
    [STATUS_CODE.UNPROCESSABLE_ENTITY]: "Unprocessable Entity",
    [STATUS_CODE.TOO_MANY_REQUESTS]: "Too Many Requests",
    [STATUS_CODE.SERVICE_UNAVAILABLE]: "Service Unavailable",
} as const;

export const HTTP_METHODS = {
    GET: "GET",
    POST: "POST",
    PUT: "PUT",
    DELETE: "DELETE",
} as const;

export type HTTPStatusCodeType = typeof STATUS_CODE[keyof typeof STATUS_CODE];
export type HTTPMethodType = keyof typeof HTTP_METHODS;
