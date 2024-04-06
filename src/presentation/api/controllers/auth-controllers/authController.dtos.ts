import { IsEmail, IsString, MinLength } from 'class-validator';
import { AuthResetPasswordDTO } from 'src/domain/dtos/auth.dtos';

export class AuthRegisterBodyDTO {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  username: string;

  @IsString()
  @MinLength(6)
  password: string;
}

export class AuthVerifyEmailBodyDTO {
  @IsString()
  @MinLength(6)
  token: string;
}

export class AuthResetPasswordEmailBodyDTO {
  @IsEmail()
  email: string;
}

export class AuthResetPasswordBodyDTO extends AuthResetPasswordDTO {}
