import { CommandHandler } from '@nestjs/cqrs';
import { ResultNotification } from '../../../../core/validation/notification';
import {
  MoneyTransaction,
  MoneyTransactionType,
} from '../../domain/entities/money-transaction.entity';
import { IsNumber, IsString } from 'class-validator';
import { WalletsRepository } from '../../db/wallets.repository';
import { MoneyTransactionsRepository } from '../../db/money-transactions-repository.service';
import { randomUUID } from 'crypto';

export class MakeTransactionCommand {
  @IsString()
  public fromWalletId: string;
  @IsString()
  public toWalletId: string;
  @IsNumber()
  public amount: number;
}

@CommandHandler(MakeTransactionCommand)
export class MakeTransactionUseCase {
  constructor(
    private walletsRepository: WalletsRepository,
    private moneyTransactionRepository: MoneyTransactionsRepository,
  ) {} // private securityGovApiAdapter: SecurityGovApiAdapter, //  private clientsRepo: ClientsRepository,

  public async execute(
    command: MakeTransactionCommand,
  ): Promise<ResultNotification<MoneyTransaction>> {
    //const notification = new ResultNotification<Client>();

    /*  const domainNotification = await Client.create(dto);
    if (domainNotification.hasError()) {
      return domainNotification;
    }
    await this.clientsRepo.save(domainNotification.data);*/
    const fromWallet = await this.walletsRepository.getById(
      command.fromWalletId,
    );
    const toWallet = await this.walletsRepository.getById(command.toWalletId);

    fromWallet.balance -= command.amount;
    toWallet.balance += command.amount;

    const transaction = new MoneyTransaction();
    transaction.id = randomUUID();
    transaction.fromWalletId = command.fromWalletId;
    transaction.toWalletId = command.toWalletId;
    transaction.withdrawalAmount = command.amount;
    transaction.depositedAmount = command.amount;
    transaction.type = MoneyTransactionType.Transfer;

    await this.walletsRepository.save(fromWallet);
    await this.walletsRepository.save(toWallet);
    await this.moneyTransactionRepository.save(transaction);

    const resultNotification = new ResultNotification<MoneyTransaction>();

    resultNotification.addData(transaction);

    return resultNotification;

    /*  const client = await Client.create(dto);
    await this.clientsRepo.save(client);
    notification.addData(client);
    return domainNotification;*/
  }
}
