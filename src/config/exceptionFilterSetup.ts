import { INestApplication, ValidationPipe } from '@nestjs/common';
import {
  ErrorExceptionFilter,
  ValidationExceptionFilter,
} from './exception.filter';

export function exceptionFilterSetup(app: INestApplication) {
  app.useGlobalFilters(
    new ErrorExceptionFilter(),
    new ValidationExceptionFilter(),
  );
}
