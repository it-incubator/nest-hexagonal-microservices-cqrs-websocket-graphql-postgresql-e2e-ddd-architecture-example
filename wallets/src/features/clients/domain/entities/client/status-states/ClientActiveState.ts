import {
  Client,
  ClientStatus,
  UpdatePassportDataCommand,
} from '../client.entity';
import { Wallet } from '../../../../../wallets/domain/entities/wallet.entity';
import { DomainResultNotification } from '../../../../../../modules/core/validation/notification';
import { IClientStatusState } from './IClientStatusState';

export class ClientActiveState implements IClientStatusState {
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

    domainResultNotification.addError("Can't be deleted");

    return domainResultNotification;
  }
}
