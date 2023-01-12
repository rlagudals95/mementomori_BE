import { ApiErrorCode } from '@errors/api-error.enum';
import { ErrorResponse } from '@errors/error-response.dto';

export class ConflictPCCCException extends ErrorResponse {
  code: ApiErrorCode = ApiErrorCode.CONFLICT_PCCC;
}
