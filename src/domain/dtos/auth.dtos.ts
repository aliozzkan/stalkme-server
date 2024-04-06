import { IsEmail, IsString, MinLength } from 'class-validator';

export class AuthRegisterDTO {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  username: string;

  @IsString()
  @MinLength(6)
  password: string;
}

export class AuthLoginDTO {
  @IsString()
  @MinLength(6)
  username: string;

  @IsString()
  @MinLength(6)
  password: string;
}

export class AuthResetPasswordDTO {
  @IsString()
  @MinLength(6)
  token: string;

  @IsString()
  @MinLength(6)
  password: string;
}
