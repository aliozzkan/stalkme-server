export enum ErrorCodeEnum {
  INVALID_TOKEN = 1,
  INVALID_EMAIL,
}

export const ErrorCodeEnumLabels = new Map<ErrorCodeEnum, string>([
  [ErrorCodeEnum.INVALID_TOKEN, 'Invalid Token'],
  [ErrorCodeEnum.INVALID_EMAIL, 'Invalid Email'],
]);
