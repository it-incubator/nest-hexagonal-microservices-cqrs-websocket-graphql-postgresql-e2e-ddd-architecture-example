import { ClientsRepository } from '../../db/clients.repository';
import {
  Client,
  UpdateClientCommand,
} from '../../domain/entities/client.entity';
import { CommandHandler } from '@nestjs/cqrs';
import { ResultNotification } from '../../../../core/validation/notification';

@CommandHandler(UpdateClientCommand)
export class UpdateClientUseCase {
  constructor(private clientsRepo: ClientsRepository) {}

  public async execute(command: UpdateClientCommand) {
    const client = await this.clientsRepo.getById(command.id);

    if (!client) throw new Error('No client');

    const domainNotification = await client.update(command);
    if (domainNotification.hasError()) {
      return domainNotification;
    }

    await this.clientsRepo.save(client);

    return new ResultNotification<Client>();
  }
}
