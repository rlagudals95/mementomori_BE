import { HttpStatus } from '@nestjs/common';
import { ApiErrorCode } from './api-error.enum';

export class ApiException extends Error {
  constructor(
    private readonly status: HttpStatus,
    private readonly errorCode: ApiErrorCode,
  ) {
    super();
  }
  getStatus(): HttpStatus {
    return this.status;
  }
  getErrorCode(): ApiErrorCode {
    return this.errorCode;
  }
}

export class ApiNotFoundException extends ApiException {
  constructor(errorCode: ApiErrorCode) {
    super(HttpStatus.NOT_FOUND, errorCode);
  }
}

export class ApiConflictException extends ApiException {
  constructor(errorCode: ApiErrorCode) {
    super(HttpStatus.CONFLICT, errorCode);
  }
}
