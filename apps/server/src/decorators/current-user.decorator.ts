// @file: server/src/decorators/current-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { JwtRequestUser } from '@/interfaces/jwt-request-user.interface'

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): JwtRequestUser => {
    const request = ctx.switchToHttp().getRequest()
    return request.user
  },
)