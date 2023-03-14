import { ClientsRepository } from '../../db/clients.repository';
import {
  Client,
  CreateClientCommand,
} from '../../domain/entities/client.entity';
import { CommandHandler } from '@nestjs/cqrs';

export class DeleteClientCommand {
  constructor(public id: string) {}
}

@CommandHandler(DeleteClientCommand)
export class DeleteClientUseCase {
  constructor(private clientsRepo: ClientsRepository) {}

  public async execute(command: DeleteClientCommand) {
    await this.clientsRepo.delete(command.id);
  }
}
