import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common';
import { Response } from 'express';
import { Logger as WinstonLogger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { I18nContext } from 'nestjs-i18n';
import { ErrorResponse } from '@errors/error-response.dto';
import { ApiException } from '@errors/api.exception';
import { IncomingMessage } from 'http';
import { ApiErrorCode } from '@errors/api-error.enum';
import { isServerError } from '@errors/error.util';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: WinstonLogger,
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const i18n = I18nContext.current(host);

    if (exception instanceof ApiException) {
      return this.handleApiException(exception, response, i18n);
    }

    if (exception instanceof HttpException) {
      return this.handleHttpException(exception, response);
    }

    const stack = (exception as Error).stack;
    const request: IncomingMessage = host.getArgByIndex(0);
    this.logger.error(
      `Uncaught exception: ${request?.method} ${request?.url}`,
      typeof stack === 'string' ? { stack } : stack,
    );

    const errorResponse: ErrorResponse = {
      code: ApiErrorCode.INTERNAL_SERVER_ERROR,
      message: 'We got an error in processing this request',
    };
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errorResponse);
  }

  handleApiException(
    exception: ApiException,
    response: Response,
    i18n: I18nContext,
  ) {
    const code = exception.getErrorCode();
    const message = i18n.t('errors.' + code) as string;
    const errorResponse: ErrorResponse = { code, message };
    return response.status(exception.getStatus()).json(errorResponse);
  }

  handleHttpException(exception: HttpException, response: Response) {
    if (isServerError(exception.getStatus())) {
      this.logger.error('Uncaught server error', exception);
    }

    const errorRes = exception.getResponse() as {
      statusCode: string;
      message: string[];
      error: string;
    };
    if (
      exception instanceof BadRequestException &&
      Array.isArray(errorRes.message)
    ) {
      const errorResponse: ErrorResponse = {
        code: ApiErrorCode.BODY_VALIDATION_FAIL,
        message: errorRes.message.join(', '),
      };
      return response.status(HttpStatus.BAD_REQUEST).json(errorResponse);
    }

    const errorResponse: ErrorResponse = {
      code: isServerError(exception.getStatus())
        ? ApiErrorCode.SERVER_ERROR
        : ApiErrorCode.CLIENT_ERROR,
      message: exception.message,
    };
    return response.status(exception.getStatus()).json(errorResponse);
    // return response
    //   .status(exception.getStatus())
    //   .json(exception.getResponse());
  }
}
