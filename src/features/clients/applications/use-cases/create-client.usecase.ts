import { ClientsRepository } from '../../db/clients.repository';
import {
  Client,
  CreateClientCommand,
} from '../../domain/entities/client.entity';
import { CommandHandler } from '@nestjs/cqrs';

@CommandHandler(CreateClientCommand)
export class CreateClientUseCase {
  constructor(private clientsRepo: ClientsRepository) {}

  public async execute(dto: CreateClientCommand) {
    const client = Client.create(dto);
    await this.clientsRepo.save(client);
    return client;
  }
}
