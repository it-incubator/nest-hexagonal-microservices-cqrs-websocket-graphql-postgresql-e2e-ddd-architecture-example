import { BaseDomainEntity } from '../../../../modules/core/entities/baseDomainEntity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Wallet } from './wallet.entity';
import { randomUUID } from 'crypto';
import { DomainResultNotification } from '../../../../modules/core/validation/notification';
import { MakemoneyTransferCommand } from '../../application/use-cases/make-money-transfer-use.case';
import { validateEntity } from '../../../../modules/core/validation/validation-utils';

export enum MoneyTransactionType {
  Exchange,
  Transfer,
}

@Entity()
export class MoneyTransfer extends BaseDomainEntity {
  @ManyToOne(() => Wallet, (wallet) => wallet.outputTransactions)
  public fromWallet: Wallet;
  @Column('uuid')
  public fromWalletId: string;
  @ManyToOne(() => Wallet, (wallet) => wallet.inputTransactions)
  public toWallet: Wallet;
  @Column('uuid')
  public toWalletId: string;
  @Column()
  public withdrawalAmount: number;
  @Column()
  public depositedAmount: number;
  @Column()
  public type: MoneyTransactionType;

  public static create(command: MakemoneyTransferCommand) {
    const transaction = new MoneyTransfer();

    const notification = new DomainResultNotification<MoneyTransfer>();

    // если больше 1000 баксов от суепрадмина - ошибка (для примера)
    if (command.amount > 1000 && command.fromWalletId === 'idsdf34344') {
      notification.addError(
        'Imposible make transfer more then 1000 for superadmin',
        'amout',
        14,
      );
      return notification;
    }

    transaction.id = randomUUID();
    transaction.fromWalletId = command.fromWalletId;
    transaction.toWalletId = command.toWalletId;
    transaction.withdrawalAmount = command.amount;
    transaction.depositedAmount = command.amount;
    transaction.type = MoneyTransactionType.Transfer;

    const createTransactionNotification =
      new DomainResultNotification<MoneyTransfer>(transaction);

    return validateEntity(transaction, []);
  }
}
