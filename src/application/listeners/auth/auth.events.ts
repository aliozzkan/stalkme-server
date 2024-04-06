import { IsEmail } from 'class-validator';

export const AUTH_VERIFY_EMAIL = 'auth.verify.email';
export class AuthVerifyEmailEvent {
  @IsEmail()
  email: string;

  constructor(params: Required<AuthVerifyEmailEvent>) {
    Object.assign(this, params);
  }
}

export const AUTH_RESET_PASS_EMAIL = 'auth.reset.email';
export class AuthResetEmailEvent {
  @IsEmail()
  email: string;

  constructor(params: Required<AuthResetEmailEvent>) {
    Object.assign(this, params);
  }
}
