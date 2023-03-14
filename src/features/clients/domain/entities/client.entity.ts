import { Wallet } from '../../../wallets/domain/entities/wallet.entity';
import { BaseDomainEntity } from '../../../../core/entities/baseDomainEntity';
import { Column, Entity } from 'typeorm';
import { randomUUID } from 'crypto';

export class CreateClientCommand {
  public firstName: string;
  public lastName: string;
}

@Entity()
export class Client extends BaseDomainEntity {
  @Column()
  public firstName: string;
  @Column()
  public lastName: string;
  @Column()
  public status: ClientStatus;

  public totalBalanceInUSD: number; // ???
  public wallets: Wallet[];
  public passportScan: FileInfo;

  static create(dto: CreateClientCommand) {
    const client = new Client();
    client.id = randomUUID();
    client.firstName = dto.firstName;
    client.lastName = dto.lastName;
    client.status = ClientStatus.OnVerification;
    return client;
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
