import { CommandHandler } from '@nestjs/cqrs';
import { MoneyTransfer } from '../../domain/entities/money-transaction.entity';
import { IsNumber, IsString } from 'class-validator';
import { WalletsRepository } from '../../db/wallets.repository';
import { MoneyTransactionsRepository } from '../../db/money-transactions-repository.service';
import { BaseUsecase } from '../../../../modules/core/app/baseUsecase';
import { DomainResultNotification } from '../../../../modules/core/validation/notification';
import { BaseUseCaseServicesWrapper } from '../../../../modules/core/infrastructure/BaseUseCaseServicesWrapper';

export class MakemoneyTransferCommand {
  @IsString()
  public fromWalletId: string;
  @IsString()
  public toWalletId: string;
  @IsNumber()
  public amount: number;
}

@CommandHandler(MakemoneyTransferCommand)
export class MakeMoneyTransferWithoutErrorCheckingForDemoUseCase extends BaseUsecase<
  MakemoneyTransferCommand,
  MoneyTransfer | null
> {
  constructor(
    private walletsRepository: WalletsRepository,
    private moneyTransactionRepository: MoneyTransactionsRepository,
    baseUseCaseServicesWrapper: BaseUseCaseServicesWrapper,
  ) {
    super(baseUseCaseServicesWrapper);
  }
  protected async onExecute(
    command: MakemoneyTransferCommand,
    //managerWrapper: EntityManagerWrapper,
    // managerWrapper: EntityManagerWrapper,
  ): Promise<DomainResultNotification<MoneyTransfer | null>> {
    const fromWallet = await this.walletsRepository.getById(
      command.fromWalletId,
    );
    const toWallet = await this.walletsRepository.getById(command.toWalletId);

    const createNotification = await MoneyTransfer.create(command);
    const addNotification = toWallet.add(command.amount);

   await this.walletsRepository.save(fromWallet, toWallet);
   await this.moneyTransactionRepository.save(createNotification.data!);

    return DomainResultNotification.merge(
      createNotification
    );
  }
}

function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}
