import { Client, UpdatePassportDataCommand } from '../client.entity';
import { Wallet } from '../../../../../wallets/domain/entities/wallet.entity';
import { DomainResultNotification } from '../../../../../../modules/core/validation/notification';

export interface IClientStatusState {
  updatePassport(command: UpdatePassportDataCommand): void;
  delete(wallets: Wallet[]): DomainResultNotification<Client>;
}
