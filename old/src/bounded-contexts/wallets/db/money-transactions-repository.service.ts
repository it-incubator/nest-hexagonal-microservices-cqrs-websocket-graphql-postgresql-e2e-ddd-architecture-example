import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../../modules/core/db/base.repository';
import { MoneyTransfer } from '../domain/entities/money-transaction.entity';
import { StoreService } from '../../../modules/core/infrastructure/store.service';

@Injectable({
  // scope: Scope.REQUEST,
})
export class MoneyTransactionsRepository extends BaseRepository<MoneyTransfer> {
  constructor(public store: StoreService) {
    super(store, MoneyTransfer);
  }
}
