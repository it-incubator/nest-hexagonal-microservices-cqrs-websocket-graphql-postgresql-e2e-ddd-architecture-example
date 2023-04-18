import { CommandHandler, EventBus } from '@nestjs/cqrs';
import { MoneyTransfer } from '../../domain/entities/money-transaction.entity';
import { IsNumber, IsString } from 'class-validator';
import { WalletsRepository } from '../../db/wallets.repository';
import { MoneyTransactionsRepository } from '../../db/money-transactions-repository.service';
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
    );

    const toWallet = await this.walletsRepository.getById(command.toWalletId);

    const createNotification = await MoneyTransfer.create(command);

    const withdrawnNotification = fromWallet.withdraw(command.amount);
    const addNotification = toWallet.add(command.amount);

    await this.walletsRepository.save(fromWallet);
    await this.walletsRepository.save(toWallet);

    await this.moneyTransactionRepository.save(createNotification.data!);

    return DomainResultNotification.create(
      createNotification,
      withdrawnNotification,
      addNotification,
    );
  }
}

function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}
