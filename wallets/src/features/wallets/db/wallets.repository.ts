import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../../modules/core/db/base.repository';
import { Wallet } from '../domain/entities/wallet.entity';
import { StoreService } from '../../clients/store.service';

@Injectable({
  //scope: Scope.REQUEST,
})
export class WalletsRepository extends BaseRepository<Wallet> {
  constructor(public store: StoreService) {
    super(store, Wallet);
  }
}
