import { ClientUpdatedEvent } from '../../domain/entities/client/events/client-updated.event';
import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { SmtpAdapter } from '../../../../modules/core/infrastructure/smtp.adapter';
import { ClientsRepository } from '../../db/clients.repository';

@EventsHandler(ClientUpdatedEvent)
export class SendEmailToManagerWhenClientUpdatedEventHandler
  implements IEventHandler<ClientUpdatedEvent>
{
  constructor(
    private smtp: SmtpAdapter,
    private clientsRepo: ClientsRepository,
  ) {}

  async handle(event: ClientUpdatedEvent) {
    console.log(event);
    const client = await this.clientsRepo.getById(event.clientId);
    await this.smtp.send(
      'client.email',
      'client changed',
      `Hey manager. Attention please. Your client ${client.firstName} ${client.lastName} was changed`,
    );
    // logic
  }
}
