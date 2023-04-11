import { DynamicModule, Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './api/admin-web/clients.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './domain/entities/client/client.entity';
import { ClientsQueryRepository } from './db/clients.query.repository';
import { ClientsRepository } from './db/clients.repository';
import { CreateClientUseCase } from './applications/use-cases/create-client.usecase';
import { CqrsModule } from '@nestjs/cqrs';
import { UpdateClientUseCase } from './applications/use-cases/update-client.usecase';
import { DeleteClientUseCase } from './applications/use-cases/delete-client.usecase';
import { SecurityGovApiAdapter } from './infrastructure/security-gov-api.adapter';
import { ClientCrudApiService } from './api/admin-web/services/clients-crud-api.service';
// import { entityManagerProvider } from '../../core/app/initEntityManagerWrapper';
import { StoreService } from './store.service';
import { SendEmailToManagerWhenClientUpdatedEventHandler } from './applications/events-handlers/send-email-to-manager-when-client-updated.event.handler';

const useCases = [
  CreateClientUseCase,
  UpdateClientUseCase,
  DeleteClientUseCase,
];

const eventHandlers = [SendEmailToManagerWhenClientUpdatedEventHandler];

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature([Client])],
  controllers: [ClientsController],
  providers: [
    ClientsService,
    ClientsQueryRepository,
    ClientsRepository,
    SecurityGovApiAdapter,
    ClientCrudApiService,
    ...useCases,
    ...eventHandlers,
    StoreService,
    // entityManagerProvider(),
  ],
})
export class ClientsModule {
  static forRoot(providers: any[]): DynamicModule {
    return {
      module: ClientsModule,
      providers: providers,
    };
  }
}
