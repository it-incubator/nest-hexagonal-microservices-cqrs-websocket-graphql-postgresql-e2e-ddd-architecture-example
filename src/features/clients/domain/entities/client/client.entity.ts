import {
  BaseDomainAggregateRootEntity,
  BaseDomainEntity,
} from '../../../../../modules/core/entities/baseDomainEntity';
import { Column, Entity } from 'typeorm';
import { randomUUID } from 'crypto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';
import { validateEntity } from '../../../../../modules/core/validation/validation-utils';
import { DomainResultNotification } from '../../../../../modules/core/validation/notification';
import { Wallet } from '../../../../wallets/domain/entities/wallet.entity';
import { ClientUpdatedEvent } from './events/client-updated.event';
import { ClientCreatedEvent } from './events/client-created.event';
import { ClientDeletedEvent } from './events/client-deleted.event';

export const validationsContsts = {
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
    validationsContsts.lastName.minLength,
    validationsContsts.lastName.maxLength,
  )
  public lastName: string;
}

export class UpdateClientCommand {
  public id: string;
  @ApiProperty()
  @Length(
    validationsContsts.firstName.minLength,
    validationsContsts.firstName.maxLength,
  )
  @IsOptional()
  public firstName?: string;
  @ApiProperty()
  @Length(
    validationsContsts.lastName.minLength,
    validationsContsts.lastName.maxLength,
  )
  @IsOptional()
  public lastName?: string;
  @ApiProperty()
  @Length(
    validationsContsts.address.minLength,
    validationsContsts.address.maxLength,
  )
  @IsOptional()
  public address?: string | null;
}

@Entity()
export class Client extends BaseDomainAggregateRootEntity {
  @Column()
  @Length(
    validationsContsts.firstName.minLength,
    validationsContsts.firstName.maxLength,
  )
  public firstName: string;
  @Column()
  @Length(
    validationsContsts.firstName.minLength,
    validationsContsts.firstName.maxLength,
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

  delete(wallets: Wallet[]) {
    const domainResultNotification = new DomainResultNotification<Client>(this);

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

    return domainResultNotification;
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
