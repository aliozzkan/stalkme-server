import { ErrorCodeEnum } from '../enums/errorCode.enum';

export interface IFormatExceptionMessage {
  message: string;
  codeError?: ErrorCodeEnum;
}

export interface IFormatExceptionMessageFromErrorCode {
  codeError: ErrorCodeEnum;
  message?: string;
}
