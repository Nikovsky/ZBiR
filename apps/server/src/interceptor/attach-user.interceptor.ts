// @file: server/src/interceptors/attach-user.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common'
import { Observable, map } from 'rxjs'

@Injectable()
export class AttachUserInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest()
    const user = req.user

    return next.handle().pipe(
      map((data) => ({
        user: user
          ? {
            id: user.id,
            email: user.email,
            username: user.username,
            role: user.role,
            regionAccess: user.regionAccess,
            exp: user.exp,
          }
          : undefined,
        data,
      })),
    )
  }
}