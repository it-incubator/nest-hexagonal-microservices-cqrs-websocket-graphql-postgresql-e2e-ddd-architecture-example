import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';

export function pipesSetup(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,

      stopAtFirstError: true,
      exceptionFactory: (errors) => {
        const err = [];
        errors.forEach((e) => {
          for (const eKey in e.constraints) {
            err.push({
              field: e.property,
              message: e.constraints[eKey],
            });
          }
        });
        throw new BadRequestException(err);
      },
    }),
  );
}

export type ValidationPipeErrorType = {
  field: string;
  message: string;
};
