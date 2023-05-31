import {
  Client,
  ClientStatus,
  UpdatePassportDataCommand,
} from '../client.entity';
import { Wallet } from '../../../../../wallets/domain/entities/wallet.entity';
import { DomainResultNotification } from '../../../../../../modules/core/validation/notification';
import { ClientDeletedEvent } from '../events/client-deleted.event';
import { IClientStatusState } from './IClientStatusState';

export class ClientBlockedState implements IClientStatusState {
  updatePassport(command: UpdatePassportDataCommand) {
    throw new Error('');
  }

  constructor(private context: Client) {}

  delete(wallets: Wallet[]): DomainResultNotification<Client> {
    const domainResultNotification = new DomainResultNotification<Client>(
      this.context,
    );

    if (wallets.some((w) => w.balance > 0)) {
      domainResultNotification.addError(
        `You can't delete client with no 0 balance`,
        null,
        1,
      );
      return domainResultNotification;
    }
    this.context.status = ClientStatus.Deleted;
    domainResultNotification.addEvents(new ClientDeletedEvent(this.context.id));

    return domainResultNotification;
  }
}
