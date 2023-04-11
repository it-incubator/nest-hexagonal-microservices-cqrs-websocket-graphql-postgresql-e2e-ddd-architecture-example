import { CommandHandler, EventBus } from '@nestjs/cqrs';
import {
  MoneyTransactionType,
  MoneyTransfer,
} from '../../domain/entities/money-transaction.entity';
import { IsNumber, IsString } from 'class-validator';
import { WalletsRepository } from '../../db/wallets.repository';
import { MoneyTransactionsRepository } from '../../db/money-transactions-repository.service';
import { randomUUID } from 'crypto';
import { BaseUsecase } from '../../../../modules/core/app/baseUsecase';
import { StoreService } from '../../../clients/store.service';
import { DomainResultNotification } from '../../../../modules/core/validation/notification';

export class MakemoneyTransferCommand {
  @IsString()
  public fromWalletId: string;
  @IsString()
  public toWalletId: string;
  @IsNumber()
  public amount: number;
}

@CommandHandler(MakemoneyTransferCommand)
export class MakeMoneyTransferUseCase extends BaseUsecase<
  MakemoneyTransferCommand,
  MoneyTransfer
> {
  constructor(
    private walletsRepository: WalletsRepository,
    private moneyTransactionRepository: MoneyTransactionsRepository,
    store: StoreService,
    eventBus: EventBus,
    // dataSource: DataSource,
  ) {
    super(store, eventBus);
  } // private securityGovApiAdapter: SecurityGovApiAdapter, //  private clientsRepo: ClientsRepository,

  protected async onExecute(
    command: MakemoneyTransferCommand,
    //managerWrapper: EntityManagerWrapper,
    // managerWrapper: EntityManagerWrapper,
  ): Promise<DomainResultNotification<MoneyTransfer>> {
    const fromWallet = await this.walletsRepository.getById(
      command.fromWalletId,
      {
        lock: true,
      },
    );

    const toWallet = await this.walletsRepository.getById(command.toWalletId, {
      lock: true,
    });

    const withdrawnNotification = fromWallet.withdraw(command.amount);
    const addNotification = toWallet.add(command.amount);

    // const createTrasactionNotification = MoneyTransfer.create()

    const transaction = new MoneyTransfer();
    transaction.id = randomUUID();
    transaction.fromWalletId = command.fromWalletId;
    transaction.toWalletId = command.toWalletId;
    transaction.withdrawalAmount = command.amount;
    transaction.depositedAmount = command.amount;
    transaction.type = MoneyTransactionType.Transfer;

    const createTransactionNotification =
      new DomainResultNotification<MoneyTransfer>(transaction);

    await this.walletsRepository.save(fromWallet);
    await this.walletsRepository.save(toWallet);

    // const toWallet2 = await this.walletsRepository.getById(command.toWalletId);

    //throw new Error('');
    await this.moneyTransactionRepository.save(transaction);

    const resultNotification = new DomainResultNotification<MoneyTransfer>();

    resultNotification.addData(transaction);

    return DomainResultNotification.create(
      createTransactionNotification,
      withdrawnNotification,
      addNotification,
    );
  }
}

function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}
