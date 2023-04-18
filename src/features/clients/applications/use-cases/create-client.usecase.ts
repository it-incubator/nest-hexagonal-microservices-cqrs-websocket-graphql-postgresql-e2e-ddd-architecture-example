import { ClientsRepository } from '../../db/clients.repository';
import {
  Client,
  CreateClientCommand,
} from '../../domain/entities/client/client.entity';
import { CommandHandler, EventBus } from '@nestjs/cqrs';
import { SecurityGovApiAdapter } from '../../infrastructure/security-gov-api.adapter';
import { DomainResultNotification } from '../../../../modules/core/validation/notification';
import { BaseUsecase } from '../../../../modules/core/app/baseUsecase';
import { StoreService } from '../../store.service';

@CommandHandler(CreateClientCommand)
export class CreateClientUseCase extends BaseUsecase<
  CreateClientCommand,
  Client
> {
  constructor(
    private clientsRepo: ClientsRepository,
    private storeService: StoreService,
    eventBus: EventBus,
    private securityGovApiAdapter: SecurityGovApiAdapter, //private storeService: StoreService,
  ) {
    super(storeService, eventBus);
  }

  protected async onExecute(
    dto: CreateClientCommand,
  ): Promise<DomainResultNotification<Client>> {
    const notification = new DomainResultNotification<Client>();
    const isSwindler = await this.securityGovApiAdapter.isSwindler(
      dto.firstName,
      dto.lastName,
    );
    if (isSwindler) {
      notification.addError('User may be swindler', null, 2);
      return notification;
    }
    const domainNotification = await Client.create(dto);
    await this.clientsRepo.save(domainNotification.data!);

    return domainNotification;
  }
}
