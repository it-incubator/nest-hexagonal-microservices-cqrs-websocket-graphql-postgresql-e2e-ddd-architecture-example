import { ClientsRepository } from '../../db/clients.repository';
import { CommandHandler } from '@nestjs/cqrs';
import { BaseUsecase } from '../../../../modules/core/app/baseUsecase';
import {
  Client,
  UpdatePassportDataCommand,
} from '../../domain/entities/client/client.entity';
import { DomainResultNotification } from '../../../../modules/core/validation/notification';
import { BaseUseCaseServicesWrapper } from '../../../../modules/core/infrastructure/BaseUseCaseServicesWrapper';

@CommandHandler(UpdatePassportDataCommand)
export class RejectClientUseCase extends BaseUsecase<
  UpdatePassportDataCommand,
  Client
> {
  constructor(
    private clientsRepo: ClientsRepository,
    baseUseCaseServicesWrapper: BaseUseCaseServicesWrapper,
  ) {
    super(baseUseCaseServicesWrapper);
  }

  protected async onExecute(
    command: UpdatePassportDataCommand,
  ): Promise<DomainResultNotification<Client>> {
    const client = await this.clientsRepo.getById(command.clientId);
    client.updatePassport(command);
    await this.clientsRepo.save(client);
    return new DomainResultNotification<Client>();
  }
}
