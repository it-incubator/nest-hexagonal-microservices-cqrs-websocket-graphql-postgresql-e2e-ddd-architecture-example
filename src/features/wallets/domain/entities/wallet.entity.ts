import { BaseDomainEntity } from '../../../../core/entities/baseDomainEntity';
import { Client } from '../../../clients/domain/entities/client.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { MoneyTransaction } from './money-transaction.entity';
import { CurrencyType } from './currencyType';

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
  @OneToMany(() => MoneyTransaction, (transaction) => transaction.toWallet)
  public inputTransactions: MoneyTransaction[];
  @OneToMany(() => MoneyTransaction, (transaction) => transaction.fromWallet)
  public outputTransactions: MoneyTransaction[];

  @OneToMany(() => Wallet, (wallet) => wallet.client)
  public wallets: Wallet[];
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
