import { ClientsRepository } from '../../db/clients.repository';
import { UpdateClientCommand } from '../../domain/entities/client.entity';
import { CommandHandler } from '@nestjs/cqrs';

@CommandHandler(UpdateClientCommand)
export class UpdateClientUseCase {
  constructor(private clientsRepo: ClientsRepository) {}

  public async execute(command: UpdateClientCommand) {
    const client = await this.clientsRepo.getById(command.id);

    if (!client) throw new Error('No client');

    client.update(command);

    await this.clientsRepo.save(client);
  }
}
