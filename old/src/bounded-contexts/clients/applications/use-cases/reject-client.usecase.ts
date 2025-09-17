import { ClientsRepository } from '../../db/clients.repository';
import { CommandHandler } from '@nestjs/cqrs';
import { BaseUsecase } from '../../../../modules/core/app/baseUsecase';
import { Client } from '../../domain/entities/client/client.entity';
import { DomainResultNotification } from '../../../../modules/core/validation/notification';
import { WalletsRepository } from '../../../wallets/db/wallets.repository';
import { BaseUseCaseServicesWrapper } from '../../../../modules/core/infrastructure/BaseUseCaseServicesWrapper';

export class RejectClientCommand {
  constructor(public id: string) {}
}

@CommandHandler(RejectClientCommand)
export class RejectClientUseCase extends BaseUsecase<
  RejectClientCommand,
  Client
> {
  constructor(
    private clientsRepo: ClientsRepository,
    private walletsRepo: WalletsRepository,
    baseUseCaseServicesWrapper: BaseUseCaseServicesWrapper,
  ) {
    super(baseUseCaseServicesWrapper);
  }

  protected async onExecute(
    command: RejectClientCommand,
  ): Promise<DomainResultNotification<Client>> {
    const client = await this.clientsRepo.getById(command.id);
    client.reject();
    await this.clientsRepo.save(client);
    return new DomainResultNotification<Client>();
  }
}
