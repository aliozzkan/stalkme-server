import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ErrorCodeEnumLabels } from 'src/domain/enums/errorCode.enum';
import {
  IFormatExceptionMessage,
  IFormatExceptionMessageFromErrorCode,
} from 'src/domain/exceptions/exceptions.interface';

@Injectable()
export class ExceptionsService {
  badRequestException(
    data: IFormatExceptionMessage | IFormatExceptionMessageFromErrorCode,
  ): void {
    throw new BadRequestException({
      message:
        data.message ?? data.codeError
          ? ErrorCodeEnumLabels.get(data.codeError)
          : 'Bad Request',
      codeError: data.codeError,
    });
  }
  internalServerErrorException(data?: IFormatExceptionMessage): void {
    throw new InternalServerErrorException(data);
  }
  forbiddenException(data?: IFormatExceptionMessage): void {
    throw new ForbiddenException(data);
  }
  unAuthorizedException(data?: IFormatExceptionMessage): void {
    throw new UnauthorizedException(data);
  }
  notFoundException(data?: IFormatExceptionMessage): void {
    throw new NotFoundException(data);
  }
}
