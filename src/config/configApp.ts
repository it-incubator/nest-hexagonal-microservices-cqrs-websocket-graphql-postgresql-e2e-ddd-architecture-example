import { INestApplication } from '@nestjs/common';
import { swaggerSetup } from './swaggerSetup';
import { pipesSetup } from './pipesSetup';

export function configApp(app: INestApplication) {
  pipesSetup(app);
  swaggerSetup(app);
}
