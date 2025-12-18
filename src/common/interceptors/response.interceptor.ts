import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ApiResponse<T = any> {
  success: boolean;
  statusCode: number;
  message?: string | null;
  data?: T | null;
  errors?: any | null;
  meta?: any | null;
}

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse> {
    const ctx = context.switchToHttp();
    const res = ctx.getResponse();
    const statusCode = res?.statusCode ?? 200;
    return next.handle().pipe(
      map((data) => ({
        success: true,
        statusCode,
        data: data ?? null,
      })),
    );
  }
}
