import { BaseDomainEntity } from '../../../../core/entities/baseDomainEntity';
import { Column, Entity } from 'typeorm';
import { randomUUID } from 'crypto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Length } from 'class-validator';
import { validateEntity } from '../../../../core/validation/validation-utils';
import { ResultNotification } from '../../../../core/validation/notification';
import { Wallet } from '../../../wallets/domain/entities/wallet.entity';

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
  // @ApiProperty()
  // forgot (or ignore) add validation
  // @Length(
  //   validationsContsts.firstName.minLength,
  //   validationsContsts.firstName.maxLength,
  // )
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
  public address?: string;
}

@Entity()
export class Client extends BaseDomainEntity {
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
  })
  public address: string | null;
  @Column()
  public status: ClientStatus;

  public totalBalanceInUSD: number; // ???
  public wallets: Wallet[];
  public passportScan: FileInfo;

  static async create(
    command: CreateClientCommand,
  ): Promise<ResultNotification<Client>> {
    const client = new Client();
    client.id = randomUUID();
    client.firstName = command.firstName;
    client.lastName = command.lastName;
    client.status = ClientStatus.OnVerification;
    client.address = null;

    return validateEntity(client);
  }

  update(command: UpdateClientCommand): Promise<ResultNotification<Client>> {
    // we not allow null and empty
    if (command.firstName) {
      this.firstName = command.firstName;
    }
    // we not allow null and empty
    if (command.lastName) {
      this.lastName = command.lastName;
    }
    // we allow null
    if (typeof command.address !== undefined) {
      this.address = command.address;
    }

    return validateEntity(this);
  }
}

enum ClientStatus {
  New = 0,
  OnVerification = 1,
  Active = 2,
  Rejected = 3,
  Blocked = 4,
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
