import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errors: string[] | null = null;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      if (typeof res === 'string') {
        message = res;
        errors = [res];
      } else if (res && typeof res === 'object') {
        const payload = res as any;
        message = payload.message || payload.error || message;

        // Try to extract human-readable strings from different payload shapes
        const collected: string[] = [];

        // helper to push all constraint messages from a ValidationError-like object
        const pushConstraints = (obj: any) => {
          if (!obj) return;
          if (obj.constraints && typeof obj.constraints === 'object') {
            Object.values(obj.constraints).forEach((v) => typeof v === 'string' && collected.push(v));
          }
        };

        if (Array.isArray(payload.errors) && payload.errors.length) {
          payload.errors.forEach((e: any) => {
            if (typeof e === 'string') {
              collected.push(e);
            } else {
              pushConstraints(e);
              if (e.message && typeof e.message === 'string') collected.push(e.message);
            }
          });
        } else if (payload.constraints) {
          Object.values(payload.constraints).forEach((v) => typeof v === 'string' && collected.push(v));
        } else if (Array.isArray(payload) && payload.length) {
          payload.forEach((e: any) => pushConstraints(e));
        } else if (payload.message && typeof payload.message === 'string') {
          collected.push(payload.message);
        } else if (payload.error && typeof payload.error === 'string') {
          collected.push(payload.error);
        }

        errors = collected.length ? collected : null;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      errors = [exception.message];
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      message,
      data: null,
      errors,
    });
  }
}
