import { UpdateClientCommand } from '../client.entity';

export class ClientUpdatedEvent {
  public clientId: string;

  public firstName?: string;
  public lastName?: string;
  public address?: string | null;

  constructor(clientId: string, command: UpdateClientCommand) {
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
