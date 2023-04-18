import { Wallet } from '../../wallet.entity';

export class WalletCreatedEvent {
  constructor(public wallet: Wallet) {}
}
