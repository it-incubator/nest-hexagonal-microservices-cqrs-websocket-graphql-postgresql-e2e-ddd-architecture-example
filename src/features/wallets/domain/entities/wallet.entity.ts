import { BaseDomainEntity } from '../../../../core/entities/baseDomainEntity';
import { Client } from '../../../clients/domain/entities/client.entity';

export class Wallet extends BaseDomainEntity {
  public title: string;
  public cardNumber: string;
  public currency: CurrencyType;
  public balance: number;
  public limits: WalletLimits;
  public sharings: WalletSharing[];
}

class WalletLimits extends BaseDomainEntity {
  public perDayLimit: number | null;
  public perWeekLimit: number | null;
  public perMonthLimit: number | null;
}

class WalletSharing extends BaseDomainEntity {
  public client: Client;
  public wallet: Wallet;
  public limits: WalletLimits;
}

enum CurrencyType {
  USD,
  RUB,
  GEL,
  BTC,
  BYN,
  UAH,
}
