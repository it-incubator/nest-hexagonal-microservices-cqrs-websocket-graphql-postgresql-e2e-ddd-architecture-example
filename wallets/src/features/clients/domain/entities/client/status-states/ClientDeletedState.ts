import { Client, UpdatePassportDataCommand } from '../client.entity';
import { Wallet } from '../../../../../wallets/domain/entities/wallet.entity';
import { DomainResultNotification } from '../../../../../../modules/core/validation/notification';
import { IClientStatusState } from './IClientStatusState';

export class ClientDeletedState implements IClientStatusState {
  updatePassport(command: UpdatePassportDataCommand) {
    throw new Error('');
  }

  constructor(private context: Client) {}

  delete(wallets: Wallet[]): DomainResultNotification<Client> {
    const domainResultNotification = new DomainResultNotification<Client>(
      this.context,
    );

    domainResultNotification.addError('Already deleted');
    return domainResultNotification;
  }
}
