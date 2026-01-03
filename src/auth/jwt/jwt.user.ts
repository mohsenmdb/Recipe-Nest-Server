import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import UserGuards from 'src/user/dto/userGuards';

export const UserReq = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): UserGuards => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);