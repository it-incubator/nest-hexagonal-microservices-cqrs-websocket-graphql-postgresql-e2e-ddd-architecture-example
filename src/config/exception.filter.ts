import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ResultNotification } from '../core/validation/notification';
import { ValidationPipeErrorType } from './pipesSetup';

@Catch(Error)
export class ErrorExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    console.log('---ErrorException', exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    if (process.env.envoirment !== `production`) {
      response
        .status(500)
        .send({ error: exception.toString(), stack: exception.stack });
    } else {
      response.status(500).send(`some error occurred`);
    }
  }
}

@Catch(HttpException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    console.log('---HttpException', exception);
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
      const resultNotification = new ResultNotification();
      resp.message.forEach((item: ValidationPipeErrorType) =>
        resultNotification.addError(item.message, item.field, 1),
      );
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
