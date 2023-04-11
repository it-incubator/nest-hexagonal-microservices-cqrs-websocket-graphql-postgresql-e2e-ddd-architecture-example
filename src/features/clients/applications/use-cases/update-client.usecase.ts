import { ClientsRepository } from '../../db/clients.repository';
import {
  Client,
  UpdateClientCommand,
} from '../../domain/entities/client/client.entity';
import { CommandHandler, EventBus } from '@nestjs/cqrs';
import { ResultNotification } from '../../../../modules/core/validation/notification';

@CommandHandler(UpdateClientCommand)
export class UpdateClientUseCase {
  constructor(
    private clientsRepo: ClientsRepository,
    private eventBus: EventBus,
  ) {}

  public async execute(command: UpdateClientCommand) {
    const client: Client = await this.clientsRepo.getById(command.id);

    if (!client) throw new Error('No client');

    const domainNotification = await client.update(command);
    if (domainNotification.hasError()) {
      return domainNotification;
    }

    await this.clientsRepo.save(client);

    return new ResultNotification<Client>();
  }
}
