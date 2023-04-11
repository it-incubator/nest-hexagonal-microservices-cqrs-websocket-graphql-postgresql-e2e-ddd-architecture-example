import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule } from './features/clients/clients.module';
import { WalletsModule } from './features/wallets/wallets.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AsyncStorageMiddleware } from './config/middlewareSetup';
import { CoreModule } from './modules/core/core.module';

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
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AsyncStorageMiddleware).forRoutes('*');
  }
}
