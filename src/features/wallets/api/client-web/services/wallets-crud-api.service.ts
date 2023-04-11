import { CommandBus } from '@nestjs/cqrs';
import { Injectable } from '@nestjs/common';

import { BaseCrudApiService } from '../../../../../modules/core/api/services/base-crud-api.service';
import { CreateWalletCommand } from '../../../application/use-cases/create-wallet.usecase';
import {
  WalletsQueryRepository,
  WalletViewModel,
} from '../../../db/wallets.query.repository';
import { Wallet } from '../../../domain/entities/wallet.entity';

@Injectable()
export class WalletsCrudApiService extends BaseCrudApiService<
  Wallet,
  CreateWalletCommand,
  WalletViewModel
> {
  constructor(commandBus: CommandBus, queryRepository: WalletsQueryRepository) {
    super(commandBus, queryRepository);
  }
}
