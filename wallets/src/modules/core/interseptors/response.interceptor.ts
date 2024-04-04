import { NestInterceptor } from '@nestjs/common';
import { map } from 'rxjs';
import { ExecutionContext } from '@nestjs/common/interfaces/features/execution-context.interface';
import { CallHandler } from '@nestjs/common/interfaces/features/nest-interceptor.interface';
import { httpHandler } from './http.handler';
import { ResultNotification } from '../validation/notification';

export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map((data) => {
        if (!(data instanceof ResultNotification)) {
          return data;
        }

        const type = context.getType();
        const handler = TypeHandlers[type];

        return handler(data);
      }),
    );
  }
}

const TypeHandlers = {
  http: httpHandler,
};
