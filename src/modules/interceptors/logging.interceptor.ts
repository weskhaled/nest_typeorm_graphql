import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const date = new Date().toISOString();
    const { fieldName } = context.getArgs()[3];
    console.time(`Request-Response time ${date} for ${fieldName}`);
    return next
      .handle()
      .pipe(
        tap(() =>
          console.timeEnd(`Request-Response time ${date} for ${fieldName}`),
        ),
      );
  }
}
