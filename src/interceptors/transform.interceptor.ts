import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const statusCode = ctx.getResponse().statusCode;
    return next.handle().pipe(
      map((data) => {
        return {
          data,
          statusCode: statusCode,
          error: null,
          message: 'Success',
          errorStack: null,
        };
      }),
    );
  }
}
