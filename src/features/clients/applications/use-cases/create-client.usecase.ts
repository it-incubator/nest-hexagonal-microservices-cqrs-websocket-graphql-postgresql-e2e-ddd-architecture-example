import { ClientsRepository } from '../../db/clients.repository';
import {
  Client,
  CreateClientCommand,
} from '../../domain/entities/client.entity';
import { CommandHandler } from '@nestjs/cqrs';
import { SecurityGovApiAdapter } from '../../infrastructure/security-gov-api.adapter';
import { ResultNotification } from '../../../../core/validation/notification';

@CommandHandler(CreateClientCommand)
export class CreateClientUseCase {
  constructor(
    private clientsRepo: ClientsRepository,
    private securityGovApiAdapter: SecurityGovApiAdapter, //private storeService: StoreService,
  ) {
    console.log('CreateClientUseCase CONSTRUCTOR');
  }

  public async execute(
    dto: CreateClientCommand,
  ): Promise<ResultNotification<Client>> {
    //console.log(this.storeService.getStore().id);
    //this.storeService.getStore().id++;
    //console.log(this.storeService.getStore().id);
    const notification = new ResultNotification<Client>();
    const isSwindler = await this.securityGovApiAdapter.isSwindler(
      dto.firstName,
      dto.lastName,
    );
    if (isSwindler) {
      notification.addError('User may be swindler', null, 2);
      return notification;
    }
    const domainNotification = await Client.create(dto);
    if (domainNotification.hasError()) {
      return domainNotification;
    }
    await this.clientsRepo.save(domainNotification.data);
    return domainNotification;

    /*  const client = await Client.create(dto);
    await this.clientsRepo.save(client);
    notification.addData(client);
    return domainNotification;*/
  }
}
