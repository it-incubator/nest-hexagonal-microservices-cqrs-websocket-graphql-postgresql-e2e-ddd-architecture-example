import { BaseDomainEntity } from '../../../../modules/core/entities/baseDomainEntity';
import { Client } from '../../../clients/domain/entities/client/client.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { MoneyTransfer } from './money-transaction.entity';
import { CurrencyType } from './currencyType';
import { DomainResultNotification } from '../../../../modules/core/validation/notification';
import { MoneyRemovedFromWalletBalanceEvent } from './wallet/events/moneyRemovedFromWalletBalanceEvent';
import { MoneyAddedToWalletBalanceEvent } from './wallet/events/moneyAddedToWalletBalanceEvent';
import { CreateWalletCommand } from '../../application/use-cases/create-wallet.usecase';
import { randomUUID } from 'crypto';
import { validateEntity } from '../../../../modules/core/validation/validation-utils';
import { WalletCreatedEvent } from './wallet/events/wallet-created.event';

@Entity()
export class Wallet extends BaseDomainEntity {
  @Column()
  public title: string;
  @Column()
  public cardNumber: string;
  @Column()
  public currency: CurrencyType;
  @ManyToOne(() => Client, (client) => client.wallets)
  public client: Client;
  @Column('uuid')
  public clientId: string;
  @Column()
  public balance: number;
  public limits: WalletLimits;
  public sharings: WalletSharing[];
  @OneToMany(() => MoneyTransfer, (transaction) => transaction.toWallet)
  public inputTransactions: MoneyTransfer[];
  @OneToMany(() => MoneyTransfer, (transaction) => transaction.fromWallet)
  public outputTransactions: MoneyTransfer[];

  @OneToMany(() => Wallet, (wallet) => wallet.client)
  public wallets: Wallet[];

  // factory
  public static create(command: CreateWalletCommand) {
    const wallet = new Wallet();
    wallet.id = randomUUID();
    wallet.title = 'USD';
    wallet.currency = CurrencyType.USD;
    wallet.balance = 100;
    wallet.clientId = command.clientId;
    wallet.cardNumber = 'sdsdsdsdsd';

    const createEvent = new WalletCreatedEvent(wallet);

    return validateEntity(wallet, [createEvent]);
  }

  public withdraw(amount: number): DomainResultNotification {
    const notification = new DomainResultNotification();
    if (this.balance < amount) {
      notification.addError('Not enough money on balance');
      return notification;
    }
    this.balance -= amount;

    notification.addEvents(
      new MoneyRemovedFromWalletBalanceEvent(this.id, amount),
    );
    return notification;
  }

  public add(amount: number): DomainResultNotification {
    const notification = new DomainResultNotification();
    this.balance += amount;
    notification.addEvents(new MoneyAddedToWalletBalanceEvent(this.id, amount));
    return notification;
  }
}

export class WalletLimits extends BaseDomainEntity {
  public perDayLimit: number | null;
  public perWeekLimit: number | null;
  public perMonthLimit: number | null;
}

export class WalletSharing extends BaseDomainEntity {
  public client: Client;
  public wallet: Wallet;
  public limits: WalletLimits;
}
