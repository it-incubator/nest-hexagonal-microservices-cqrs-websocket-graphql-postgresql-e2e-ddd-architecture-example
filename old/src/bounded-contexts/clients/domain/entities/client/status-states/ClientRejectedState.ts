import {
  Client,
  ClientStatus,
  UpdatePassportDataCommand,
} from '../client.entity';
import { Wallet } from '../../../../../wallets/domain/entities/wallet.entity';
import { DomainResultNotification } from '../../../../../../modules/core/validation/notification';
import { ClientDeletedEvent } from '../events/client-deleted.event';
import { IClientStatusState } from './IClientStatusState';

export class ClientRejectedState implements IClientStatusState {
  updatePassport(command: UpdatePassportDataCommand) {
    this.context.passportData.serial = command.serial;
    this.context.passportData.number = command.number;
    this.context.passportData.issueDate = command.issueDate;

    this.context.status = ClientStatus.OnVerification;
  }

  constructor(private context: Client) {}

  delete(wallets: Wallet[]): DomainResultNotification<Client> {
    const domainResultNotification = new DomainResultNotification<Client>(
      this.context,
    );

    this.context.status = ClientStatus.Deleted;
    domainResultNotification.addEvents(new ClientDeletedEvent(this.context.id));

    return domainResultNotification;
  }
}
