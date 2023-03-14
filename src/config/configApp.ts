import { INestApplication } from '@nestjs/common';
import { swaggerSetup } from './swaggerSetup';

export function configApp(app: INestApplication) {
  swaggerSetup(app);
}
