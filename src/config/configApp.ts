import { INestApplication } from '@nestjs/common';
import { swaggerSetup } from './swaggerSetup';
import { pipesSetup } from './pipesSetup';
import { exceptionFilterSetup } from './exceptionFilterSetup';

export function configApp(app: INestApplication) {
  pipesSetup(app);
  swaggerSetup(app);
  exceptionFilterSetup(app);
}
