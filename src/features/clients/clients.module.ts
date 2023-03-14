import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './api/admin-web/clients.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Client } from './domain/entities/client.entity';
import { ClientsQueryRepository } from './db/clients.query.repository';
import { ClientsRepository } from './db/clients.repository';
import { CreateClientUseCase } from './applications/use-cases/create-client.usecase';

const useCases = [CreateClientUseCase];

@Module({
  imports: [TypeOrmModule.forFeature([Client])],
  controllers: [ClientsController],
  providers: [
    ClientsService,
    ClientsQueryRepository,
    ClientsRepository,
    ...useCases,
  ],
})
export class ClientsModule {}
