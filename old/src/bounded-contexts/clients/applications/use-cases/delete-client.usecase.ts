import { ClientsRepository } from '../../db/clients.repository';
import { CommandHandler } from '@nestjs/cqrs';
import { BaseUsecase } from '../../../../modules/core/app/baseUsecase';
import { Client } from '../../domain/entities/client/client.entity';
import { DomainResultNotification } from '../../../../modules/core/validation/notification';
import { WalletsRepository } from '../../../wallets/db/wallets.repository';
import { BaseUseCaseServicesWrapper } from '../../../../modules/core/infrastructure/BaseUseCaseServicesWrapper';

export class DeleteClientCommand {
  constructor(public id: string) {}
}

@CommandHandler(DeleteClientCommand)
export class DeleteClientUseCase extends BaseUsecase<
  DeleteClientCommand,
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
    command: DeleteClientCommand,
  ): Promise<DomainResultNotification<Client>> {
    const client = await this.clientsRepo.getById(command.id);

    const wallets = await this.walletsRepo.getMany({ clientId: client!.id });

    const domainNotification = await client!.delete(wallets);
    await this.clientsRepo.delete(command.id);
    return domainNotification;
  }
}
