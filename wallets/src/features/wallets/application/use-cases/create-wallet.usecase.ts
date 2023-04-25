import { CommandHandler } from '@nestjs/cqrs';
import { DomainResultNotification } from '../../../../modules/core/validation/notification';
import { IsString } from 'class-validator';
import { WalletsRepository } from '../../db/wallets.repository';
import { Wallet } from '../../domain/entities/wallet.entity';
import { BaseUsecase } from '../../../../modules/core/app/baseUsecase';
import { BaseUseCaseServicesWrapper } from '../../../../modules/core/infrastructure/BaseUseCaseServicesWrapper';

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
    baseUseCaseServicesWrapper: BaseUseCaseServicesWrapper,
  ) {
    super(baseUseCaseServicesWrapper);
  }

  protected async onExecute(
    command: CreateWalletCommand,
  ): Promise<DomainResultNotification<Wallet>> {
    const notification = await Wallet.create(command);
    await this.walletsRepository.save(notification.data!);
    return notification;
  }
}
