import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { swaggerSetup } from './config/swaggerSetup';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  swaggerSetup(app);

  await app.listen(3000);
}

bootstrap();
