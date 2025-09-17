import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule } from './bounded-contexts/clients/clients.module';
import { WalletsModule } from './bounded-contexts/wallets/wallets.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AsyncStorageMiddleware } from './config/middlewareSetup';
import { CoreModule } from './modules/core/core.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './modules/core/interseptors/response.interceptor';

@Module({
  imports: [
    ClientsModule,
    WalletsModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'nodejs',
      password: 'nodejs',
      database: 'wallets-management',
      autoLoadEntities: true,
      synchronize: true,
      logging: ['error'],
    }),
    CoreModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AsyncStorageMiddleware).forRoutes('*');
  }
}
