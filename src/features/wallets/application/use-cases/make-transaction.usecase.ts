import { CommandHandler } from '@nestjs/cqrs';
import { ResultNotification } from '../../../../core/validation/notification';
import {
  MoneyTransactionType,
  MoneyTransfer,
} from '../../domain/entities/money-transaction.entity';
import { IsNumber, IsString } from 'class-validator';
import { WalletsRepository } from '../../db/wallets.repository';
import { MoneyTransactionsRepository } from '../../db/money-transactions-repository.service';
import { randomUUID } from 'crypto';
import { BaseUsecase } from '../../../../core/app/baseUsecase';
import { StoreService } from '../../../clients/store.service';

export class MakeTransactionCommand {
  @IsString()
  public fromWalletId: string;
  @IsString()
  public toWalletId: string;
  @IsNumber()
  public amount: number;
}

@CommandHandler(MakeTransactionCommand)
export class MakeTransactionUseCase extends BaseUsecase<
  MakeTransactionCommand,
  ResultNotification<MoneyTransfer>
> {
  constructor(
    private walletsRepository: WalletsRepository,
    private moneyTransactionRepository: MoneyTransactionsRepository,
    store: StoreService,
    // dataSource: DataSource,
  ) {
    super(store);
  } // private securityGovApiAdapter: SecurityGovApiAdapter, //  private clientsRepo: ClientsRepository,

  protected async onExecute(
    command: MakeTransactionCommand,
    //managerWrapper: EntityManagerWrapper,
    // managerWrapper: EntityManagerWrapper,
  ): Promise<ResultNotification<MoneyTransfer>> {
    const fromWallet = await this.walletsRepository.getById(
      command.fromWalletId,
      {
        lock: true,
      },
    );

    // await delay(1000);

    /*  this.setManager(
      manager,
      this.walletsRepository,
      this.moneyTransactionRepository,
    );*/

    const toWallet = await this.walletsRepository.getById(command.toWalletId, {
      lock: true,
    });

    fromWallet.balance -= command.amount;
    toWallet.balance += command.amount;

    const transaction = new MoneyTransfer();
    transaction.id = randomUUID();
    transaction.fromWalletId = command.fromWalletId;
    transaction.toWalletId = command.toWalletId;
    transaction.withdrawalAmount = command.amount;
    transaction.depositedAmount = command.amount;
    transaction.type = MoneyTransactionType.Transfer;

    await this.walletsRepository.save(fromWallet);
    await this.walletsRepository.save(toWallet);

    // const toWallet2 = await this.walletsRepository.getById(command.toWalletId);

    //throw new Error('');
    await this.moneyTransactionRepository.save(transaction);

    const resultNotification = new ResultNotification<MoneyTransfer>();

    resultNotification.addData(transaction);

    return resultNotification;
  }
}

function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}
