import { IsString } from 'class-validator';
import { ApiErrorCode } from './api-error.enum';

export class ErrorResponse {
  @IsString()
  code: ApiErrorCode;

  @IsString()
  message: string;
}
