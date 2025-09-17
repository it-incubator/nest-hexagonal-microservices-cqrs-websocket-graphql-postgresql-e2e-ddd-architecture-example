import { UpdateClientCommand } from '../client.entity';

export type DomainEventMeta =
    {
      type: string,
      date: Date,
      userId: string | null,
      requestId: string
    }

export abstract class DomainEvent {
  private type: string;

  public meta: DomainEventMeta

  constructor(type: string) {
    this.type = type;
  }

  public setMeta(meta: DomainEventMeta) {
    this.meta = {
      ...meta,
      type: this.type
    };
  }
}

export class ClientUpdatedEvent extends DomainEvent {
  static type = 'finance/wallet/client-updated';
  public clientId: string;

  public firstName?: string;
  public lastName?: string;
  public address?: string | null;

  constructor(clientId: string, command: UpdateClientCommand) {
    super(ClientUpdatedEvent.type);
    this.clientId = clientId;

    if (typeof command.address !== 'undefined') {
      this.address = command.address;
    }
    if (command.firstName) {
      this.lastName = command.firstName;
    }
    if (command.lastName) {
      this.lastName = command.lastName;
    }
  }
}
