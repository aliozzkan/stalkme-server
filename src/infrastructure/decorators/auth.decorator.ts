import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserM } from 'src/domain/models/user.model';

export const CurrentAuth = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (!request.user) return null;

    return request.user;
  },
);

export class AuthUser {
  user: UserM;
  token: string;

  constructor(params: AuthUser) {
    Object.assign(this, params);
  }
}
