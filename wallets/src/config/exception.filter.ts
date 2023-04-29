import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ResultNotification } from '../modules/core/validation/notification';
import {
  DomainError,
  mapErrorsToNotification,
} from '../modules/core/validation/validation-utils';

@Catch(DomainError)
export class ErrorExceptionFilter implements ExceptionFilter {
  catch(exception: DomainError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.status(400).send(exception.resultNotification);
  }
}

@Catch(HttpException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    if (status === 400) {
      const resp: any = exception.getResponse();
      if (resp instanceof ResultNotification) {
        response.status(status).json(resp);
        return;
      }
      const resultNotification = mapErrorsToNotification(resp.message);
      response.status(status).json(resultNotification);
    } else {
      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }
  }
}
