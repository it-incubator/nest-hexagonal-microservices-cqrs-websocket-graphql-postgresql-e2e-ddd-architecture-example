import { BaseDomainEntity } from '../../../../../modules/core/entities/baseDomainEntity';
import { AfterLoad, Column, Entity } from 'typeorm';
import { randomUUID } from 'crypto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';
import { validateEntity } from '../../../../../modules/core/validation/validation-utils';
import { DomainResultNotification } from '../../../../../modules/core/validation/notification';
import { Wallet } from '../../../../wallets/domain/entities/wallet.entity';
import { ClientUpdatedEvent } from './events/client-updated.event';
import { ClientCreatedEvent } from './events/client-created.event';
import { IClientStatusState } from './status-states/IClientStatusState';
import { ClientDeletedState } from './status-states/ClientDeletedState';
import { ClientBlockedState } from './status-states/ClientBlockedState';
import { ClientRejectedState } from './status-states/ClientRejectedState';
import { ClientActiveState } from './status-states/ClientActiveState';
import { ClientOnVerificationState } from './status-states/ClientOnVerificationState';
import { ClientNewState } from './status-states/ClientNewState';

export const validationsConstants = {
  firstName: {
    minLength: 2,
    maxLength: 30,
  },
  lastName: {
    minLength: 2,
    maxLength: 30,
  },
  address: {
    minLength: 10,
    maxLength: 30,
  },
};

export class CreateClientCommand {
  @IsString()
  public firstName: string;
  @ApiProperty()
  @Length(
    validationsConstants.lastName.minLength,
    validationsConstants.lastName.maxLength,
  )
  public lastName: string;
}

export class UpdatePassportDataCommand {
  constructor(
    public serial: string,
    public number: string,
    public issueDate: Date,
    public clientId: string,
  ) {}
}

export class UpdateClientCommand {
  public id: string;
  @ApiProperty()
  @Length(
    validationsConstants.firstName.minLength,
    validationsConstants.firstName.maxLength,
  )
  @IsOptional()
  public firstName?: string;
  @ApiProperty()
  @Length(
    validationsConstants.lastName.minLength,
    validationsConstants.lastName.maxLength,
  )
  @IsOptional()
  public lastName?: string;
  @ApiProperty()
  @Length(
    validationsConstants.address.minLength,
    validationsConstants.address.maxLength,
  )
  @IsOptional()
  public address?: string | null;
}

@Entity()
export class Client extends BaseDomainEntity {
  @Column()
  @Length(
    validationsConstants.firstName.minLength,
    validationsConstants.firstName.maxLength,
  )
  public firstName: string;
  @Column()
  @Length(
    validationsConstants.firstName.minLength,
    validationsConstants.firstName.maxLength,
  )
  public lastName: string;
  @Column({
    nullable: true,
    type: 'text',
  })
  public address: string | null;
  @Column()
  public status: ClientStatus;

  public totalBalanceInUSD: number; // ???
  public wallets: Wallet[];
  public passportScan: FileInfo;
  public passportData: PassportInfo;
  private clientStatusState: IClientStatusState;
  static async create(
    command: CreateClientCommand,
  ): Promise<DomainResultNotification<Client>> {
    const client = new Client();
    client.id = randomUUID();
    client.firstName = command.firstName;
    client.lastName = command.lastName;
    client.status = ClientStatus.OnVerification;
    client.address = null;

    const clientCreatedEvent = new ClientCreatedEvent(
      client.id,
      client.firstName,
      client.lastName,
      client.status,
      client.address,
    );
    return validateEntity(client, [clientCreatedEvent]);
  }

  update(
    command: UpdateClientCommand,
  ): Promise<DomainResultNotification<Client>> {
    // we not allow null and empty
    if (command.firstName) {
      this.firstName = command.firstName;
    }
    // we not allow null and empty
    if (command.lastName) {
      this.lastName = command.lastName;
    }
    // we allow null
    if (typeof command.address !== 'undefined') {
      this.address = command.address;
    }

    const updateEvent = new ClientUpdatedEvent(this.id, command);

    return validateEntity(this, [updateEvent]);
  }

  @AfterLoad()
  initStatusState(): void {
    switch (this.status) {
      case ClientStatus.New:
        this.clientStatusState = new ClientNewState(this);
        return;
      case ClientStatus.OnVerification:
        this.clientStatusState = new ClientOnVerificationState(this);
        return;
      case ClientStatus.Active:
        this.clientStatusState = new ClientActiveState(this);
        return;
      case ClientStatus.Rejected:
        this.clientStatusState = new ClientRejectedState(this);
        return;
      case ClientStatus.Blocked:
        this.clientStatusState = new ClientBlockedState(this);
        return;
      case ClientStatus.Deleted:
        this.clientStatusState = new ClientDeletedState(this);
        return;
      default:
        throw new Error(
          'ClientStatusState is not registered for this status: ' + this.status,
        );
    }
  }

  delete(wallets: Wallet[]) {
    this.clientStatusState.delete(wallets);
    const domainResultNotification = new DomainResultNotification<Client>(this);
    return domainResultNotification;
    /* const domainResultNotification = new DomainResultNotification<Client>(this);

    if (this.status === ClientStatus.Deleted) {
      domainResultNotification.addError(`Client is alreade deleted`, null, 1);
      return domainResultNotification;
    }

    if (wallets.some((w) => w.balance > 0)) {
      domainResultNotification.addError(
        `You can't delete client with no 0 balance`,
        null,
        1,
      );
      return domainResultNotification;
    }
    this.status = ClientStatus.Deleted;
    domainResultNotification.addEvents(new ClientDeletedEvent(this.id));

    return domainResultNotification;*/
  }

  activate() {
    if (this.status !== ClientStatus.OnVerification) {
      throw new Error(`can't be activate`);
    }
    this.status = ClientStatus.Active;
  }

  reject() {
    if (this.status !== ClientStatus.OnVerification) {
      throw new Error(`can't be rejected`);
    }
    this.status = ClientStatus.Rejected;
  }

  updatePassportDeprecated(command: UpdatePassportDataCommand) {
    switch (this.status) {
      case ClientStatus.New:
        this.passportData.serial = command.serial;
        this.passportData.number = command.number;
        this.passportData.issueDate = command.issueDate;
        break;
      case ClientStatus.OnVerification:
        throw new Error('');
        break;
      case ClientStatus.Active:
        this.passportData.serial = command.serial;
        this.passportData.number = command.number;
        this.passportData.issueDate = command.issueDate;

        this.status = ClientStatus.OnVerification;
        break;
      case ClientStatus.Rejected:
        this.passportData.serial = command.serial;
        this.passportData.number = command.number;
        this.passportData.issueDate = command.issueDate;

        this.status = ClientStatus.OnVerification;
        break;
      case ClientStatus.Blocked:
        throw new Error('');
        break;
      case ClientStatus.Deleted:
        throw new Error('');
        break;
    }
  }
  updatePassport(command: UpdatePassportDataCommand) {
    this.clientStatusState.updatePassport(command);
  }
}

export enum ClientStatus {
  New = 0,
  OnVerification = 1,
  Active = 2,
  Rejected = 3,
  Blocked = 4,
  Deleted = 5,
}

class PassportScan extends BaseDomainEntity {
  public fileInfo: FileInfo;
  public status: PassportScanStatus;
}

enum PassportScanStatus {}

class FileInfo extends BaseDomainEntity {
  public url: string;
  public title: string;
}

class PassportInfo extends BaseDomainEntity {
  public serial: string;
  public number: string;
  public issueDate: Date;
}
