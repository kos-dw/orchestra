import { HTTP_STATUS } from "app/shared/constants";
type HttpErrorStatus =
  | 400
  | 401
  | 402
  | 403
  | 404
  | 405
  | 406
  | 407
  | 408
  | 409
  | 410
  | 411
  | 412
  | 413
  | 414
  | 415
  | 416
  | 417
  | 418
  | 421
  | 422
  | 423
  | 424
  | 425
  | 426
  | 428
  | 429
  | 431
  | 451
  | 500
  | 501
  | 502
  | 503
  | 504
  | 505
  | 506
  | 507
  | 508
  | 510
  | 511;

type ExceptionPayload = {
  Ok: null;
  Err: {
    message: string;
    status: HttpErrorStatus;
  };
};

class Exception extends Error {
  static {
    this.prototype.name = "Exception";
  }
  constructor(
    message: string,
    private status: HttpErrorStatus,
  ) {
    super(message);
  }

  get payload(): ExceptionPayload {
    let message;
    switch (this.status) {
      case HTTP_STATUS.BAD_REQUEST:
        message = HTTP_STATUS[HTTP_STATUS.BAD_REQUEST];
        break;
      case HTTP_STATUS.UNAUTHORIZED:
        message = HTTP_STATUS[HTTP_STATUS.UNAUTHORIZED];
        break;
      case HTTP_STATUS.PAYMENT_REQUIRED:
        message = HTTP_STATUS[HTTP_STATUS.PAYMENT_REQUIRED];
        break;
      case HTTP_STATUS.FORBIDDEN:
        message = HTTP_STATUS[HTTP_STATUS.FORBIDDEN];
        break;
      case HTTP_STATUS.NOT_FOUND:
        message = HTTP_STATUS[HTTP_STATUS.NOT_FOUND];
        break;
      case HTTP_STATUS.METHOD_NOT_ALLOWED:
        message = HTTP_STATUS[HTTP_STATUS.METHOD_NOT_ALLOWED];
        break;
      case HTTP_STATUS.NOT_ACCEPTABLE:
        message = HTTP_STATUS[HTTP_STATUS.NOT_ACCEPTABLE];
        break;
      case HTTP_STATUS.PROXY_AUTHENTICATION_REQUIRED:
        message =
          HTTP_STATUS[HTTP_STATUS.PROXY_AUTHENTICATION_REQUIRED];
        break;
      case HTTP_STATUS.REQUEST_TIMEOUT:
        message = HTTP_STATUS[HTTP_STATUS.REQUEST_TIMEOUT];
        break;
      case HTTP_STATUS.CONFLICT:
        message = HTTP_STATUS[HTTP_STATUS.CONFLICT];
        break;
      case HTTP_STATUS.GONE:
        message = HTTP_STATUS[HTTP_STATUS.GONE];
        break;
      case HTTP_STATUS.LENGTH_REQUIRED:
        message = HTTP_STATUS[HTTP_STATUS.LENGTH_REQUIRED];
        break;
      case HTTP_STATUS.PRECONDITION_FAILED:
        message = HTTP_STATUS[HTTP_STATUS.PRECONDITION_FAILED];
        break;
      case HTTP_STATUS.PAYLOAD_TOO_LARGE:
        message = HTTP_STATUS[HTTP_STATUS.PAYLOAD_TOO_LARGE];
        break;
      case HTTP_STATUS.URI_TOO_LONG:
        message = HTTP_STATUS[HTTP_STATUS.URI_TOO_LONG];
        break;
      case HTTP_STATUS.UNSUPPORTED_MEDIA_TYPE:
        message = HTTP_STATUS[HTTP_STATUS.UNSUPPORTED_MEDIA_TYPE];
        break;
      case HTTP_STATUS.RANGE_NOT_SATISFIABLE:
        message = HTTP_STATUS[HTTP_STATUS.RANGE_NOT_SATISFIABLE];
        break;
      case HTTP_STATUS.EXPECTATION_FAILED:
        message = HTTP_STATUS[HTTP_STATUS.EXPECTATION_FAILED];
        break;
      case HTTP_STATUS.IM_A_TEAPOT:
        message = HTTP_STATUS[HTTP_STATUS.IM_A_TEAPOT];
        break;
      case HTTP_STATUS.MISDIRECTED_REQUEST:
        message = HTTP_STATUS[HTTP_STATUS.MISDIRECTED_REQUEST];
        break;
      case HTTP_STATUS.UNPROCESSABLE_ENTITY:
        message = HTTP_STATUS[HTTP_STATUS.UNPROCESSABLE_ENTITY];
        break;
      case HTTP_STATUS.LOCKED:
        message = HTTP_STATUS[HTTP_STATUS.LOCKED];
        break;
      case HTTP_STATUS.FAILED_DEPENDENCY:
        message = HTTP_STATUS[HTTP_STATUS.FAILED_DEPENDENCY];
        break;
      case HTTP_STATUS.TOO_EARLY:
        message = HTTP_STATUS[HTTP_STATUS.TOO_EARLY];
        break;
      case HTTP_STATUS.UPGRADE_REQUIRED:
        message = HTTP_STATUS[HTTP_STATUS.UPGRADE_REQUIRED];
        break;
      case HTTP_STATUS.PRECONDITION_REQUIRED:
        message = HTTP_STATUS[HTTP_STATUS.PRECONDITION_REQUIRED];
        break;
      case HTTP_STATUS.TOO_MANY_REQUESTS:
        message = HTTP_STATUS[HTTP_STATUS.TOO_MANY_REQUESTS];
        break;
      case HTTP_STATUS.REQUEST_HEADER_FIELDS_TOO_LARGE:
        message =
          HTTP_STATUS[HTTP_STATUS.REQUEST_HEADER_FIELDS_TOO_LARGE];
        break;
      case HTTP_STATUS.UNAVAILABLE_FOR_LEGAL_REASONS:
        message =
          HTTP_STATUS[HTTP_STATUS.UNAVAILABLE_FOR_LEGAL_REASONS];
        break;
      case HTTP_STATUS.INTERNAL_SERVER_ERROR:
        message = HTTP_STATUS[HTTP_STATUS.INTERNAL_SERVER_ERROR];
        break;
      case HTTP_STATUS.NOT_IMPLEMENTED:
        message = HTTP_STATUS[HTTP_STATUS.NOT_IMPLEMENTED];
        break;
      case HTTP_STATUS.BAD_GATEWAY:
        message = HTTP_STATUS[HTTP_STATUS.BAD_GATEWAY];
        break;
      case HTTP_STATUS.SERVICE_UNAVAILABLE:
        message = HTTP_STATUS[HTTP_STATUS.SERVICE_UNAVAILABLE];
        break;
      case HTTP_STATUS.GATEWAY_TIMEOUT:
        message = HTTP_STATUS[HTTP_STATUS.GATEWAY_TIMEOUT];
        break;
      case HTTP_STATUS.HTTP_VERSION_NOT_SUPPORTED:
        message = HTTP_STATUS[HTTP_STATUS.HTTP_VERSION_NOT_SUPPORTED];
        break;
      case HTTP_STATUS.VARIANT_ALSO_NEGOTIATES:
        message = HTTP_STATUS[HTTP_STATUS.VARIANT_ALSO_NEGOTIATES];
        break;
      case HTTP_STATUS.INSUFFICIENT_STORAGE:
        message = HTTP_STATUS[HTTP_STATUS.INSUFFICIENT_STORAGE];
        break;
      case HTTP_STATUS.LOOP_DETECTED:
        message = HTTP_STATUS[HTTP_STATUS.LOOP_DETECTED];
        break;
      case HTTP_STATUS.NOT_EXTENDED:
        message = HTTP_STATUS[HTTP_STATUS.NOT_EXTENDED];
        break;
      case HTTP_STATUS.NETWORK_AUTHENTICATION_REQUIRED:
        message =
          HTTP_STATUS[HTTP_STATUS.NETWORK_AUTHENTICATION_REQUIRED];
        break;
      default:
        message = "Unknown error";
        break;
    }

    return {
      Ok: null,
      Err: {
        message: message,
        status: this.status,
      },
    };
  }
}

//コントローラー層のcatchブロックで行う処理を共通化
function catchException(e: unknown): ExceptionPayload {
  if (e instanceof Exception) {
    return e.payload;
  }
  return {
    Ok: null,
    Err: {
      message: HTTP_STATUS[HTTP_STATUS.INTERNAL_SERVER_ERROR],
      status: HTTP_STATUS.INTERNAL_SERVER_ERROR,
    },
  };
}

export { catchException, Exception };
