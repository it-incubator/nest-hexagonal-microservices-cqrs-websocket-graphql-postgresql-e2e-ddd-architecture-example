import { CommandHandler, EventBus } from '@nestjs/cqrs';
import { DomainResultNotification } from '../../../../modules/core/validation/notification';
import { IsString } from 'class-validator';
import { WalletsRepository } from '../../db/wallets.repository';
import { Wallet } from '../../domain/entities/wallet.entity';
import { BaseUsecase } from '../../../../modules/core/app/baseUsecase';
import { StoreService } from '../../../clients/store.service';

export class CreateWalletCommand {
  @IsString()
  public clientId: string;
}

@CommandHandler(CreateWalletCommand)
export class CreateWalletUseCase extends BaseUsecase<
  CreateWalletCommand,
  Wallet
> {
  constructor(
    private walletsRepository: WalletsRepository,
    eventBus: EventBus,
    storeService: StoreService,
  ) {
    super(storeService, eventBus);
  }

  protected async onExecute(
    command: CreateWalletCommand,
  ): Promise<DomainResultNotification<Wallet>> {
    const notification = await Wallet.create(command);
    await this.walletsRepository.save(notification.data!);
    return notification;
  }
}
