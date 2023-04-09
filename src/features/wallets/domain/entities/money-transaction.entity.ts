import { BaseDomainEntity } from '../../../../core/entities/baseDomainEntity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Wallet } from './wallet.entity';

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
}
