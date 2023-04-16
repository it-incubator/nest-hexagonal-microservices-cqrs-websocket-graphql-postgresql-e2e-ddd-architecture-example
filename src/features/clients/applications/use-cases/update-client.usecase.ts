import { ClientsRepository } from '../../db/clients.repository';
import {
  Client,
  UpdateClientCommand,
} from '../../domain/entities/client/client.entity';
import { CommandHandler, EventBus } from '@nestjs/cqrs';
import { ClientUpdatedEvent } from '../../domain/entities/client/events/client-updated.event';

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

    this.eventBus.publish(new ClientUpdatedEvent(client.id, command));

    return domainNotification;
  }
}
