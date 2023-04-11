import { CommandHandler } from '@nestjs/cqrs';
import { ResultNotification } from '../../../../modules/core/validation/notification';
import { IsString } from 'class-validator';
import { WalletsRepository } from '../../db/wallets.repository';
import { Wallet } from '../../domain/entities/wallet.entity';
import { CurrencyType } from '../../domain/entities/currencyType';
import { randomUUID } from 'crypto';

export class CreateWalletCommand {
  @IsString()
  public clientId: string;
}

@CommandHandler(CreateWalletCommand)
export class CreateWalletUseCase {
  constructor(private walletsRepository: WalletsRepository) {}

  public async execute(
    command: CreateWalletCommand,
  ): Promise<ResultNotification<Wallet>> {
    const notification = new ResultNotification<Wallet>();

    const wallet = new Wallet();
    wallet.id = randomUUID();
    wallet.title = 'USD';
    wallet.currency = CurrencyType.USD;
    wallet.balance = 100;
    wallet.clientId = command.clientId;
    wallet.cardNumber = 'sdsdsdsdsd';

    await this.walletsRepository.save(wallet);
    notification.addData(wallet);
    return notification;

    /*  const client = await Client.create(dto);
    await this.clientsRepo.save(client);
    notification.addData(client);
    return domainNotification;*/
  }
}
