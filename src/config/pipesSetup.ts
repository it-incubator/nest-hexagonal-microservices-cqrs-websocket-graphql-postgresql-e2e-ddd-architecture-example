import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';

export const validationErrorsMapper = {
  mapValidationErrorArrayToValidationPipeErrorTypeArray(
    errors: ValidationError[],
  ): ValidationPipeErrorType[] {
    return errors.flatMap((error) =>
      Object.entries(error.constraints).map(([key, value]) => ({
        field: error.property,
        message: value,
      })),
    );
  },
};

export function pipesSetup(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,

      stopAtFirstError: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const err =
          validationErrorsMapper.mapValidationErrorArrayToValidationPipeErrorTypeArray(
            errors,
          );
        throw new BadRequestException(err);
      },
    }),
  );
}

export type ValidationPipeErrorType = {
  field: string;
  message: string;
};
