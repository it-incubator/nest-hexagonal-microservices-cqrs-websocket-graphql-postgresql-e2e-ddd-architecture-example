import { ClientsRepository } from '../../db/clients.repository';
import {
  Client,
  UpdateClientCommand,
} from '../../domain/entities/client/client.entity';
import { CommandHandler } from '@nestjs/cqrs';
import { DomainResultNotification } from '../../../../modules/core/validation/notification';
import { BaseUsecase } from '../../../../modules/core/app/baseUsecase';
import { BaseUseCaseServicesWrapper } from '../../../../modules/core/infrastructure/BaseUseCaseServicesWrapper';

@CommandHandler(UpdateClientCommand)
export class UpdateClientUseCase extends BaseUsecase<
  UpdateClientCommand,
  Client
> {
  constructor(
    private clientsRepo: ClientsRepository,
    baseUseCaseServicesWrapper: BaseUseCaseServicesWrapper,
  ) {
    super(baseUseCaseServicesWrapper);
  }

  protected async onExecute(
    command: UpdateClientCommand,
  ): Promise<DomainResultNotification<Client>> {
    const client: Client = await this.clientsRepo.getById(command.id);

    if (!client) throw new Error('No client');

    const domainNotification = await client.update(command);

    await this.clientsRepo.save(client);

    return domainNotification;
  }
}
