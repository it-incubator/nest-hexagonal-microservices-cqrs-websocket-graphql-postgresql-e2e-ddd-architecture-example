import { ClientStatus } from '../client.entity';

export class ClientCreatedEvent {
  constructor(
    public clientId: string,
    public firstName: string,
    public lastName: string,
    public status: ClientStatus,
    public address: string | null,
  ) {}
}
