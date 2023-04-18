import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { BaseQueryRepository } from '../../../modules/core/db/base.query.repository';
import { MoneyTransfer } from '../domain/entities/money-transaction.entity';

@Injectable()
export class MoneyTransactionsQueryRepository
  implements BaseQueryRepository<MoneyTransactionsViewModel>
{
  constructor(
    @InjectRepository(MoneyTransfer)
    private ormRepo: Repository<MoneyTransfer>,
  ) {}

  async getAll(): Promise<MoneyTransactionsViewModel[]> {
    const clients = await this.ormRepo.find({});
    return clients.map(MoneyTransactionsQueryRepository.mapEntityToViewModel);
  }

  async getById(id: string): Promise<MoneyTransactionsViewModel | null> {
    const entity = await this.ormRepo.findOneBy({
      id: id,
    });
    if (!entity) return null;
    return MoneyTransactionsQueryRepository.mapEntityToViewModel(entity);
  }

  static mapEntityToViewModel(
    entity: MoneyTransfer,
  ): MoneyTransactionsViewModel {
    const viewModel: MoneyTransactionsViewModel = {
      id: entity.id,
      fromWalletId: entity.fromWalletId,
      toWalletId: entity.toWalletId,
      withdrawalAmount: entity.withdrawalAmount,
      depositedAmount: entity.depositedAmount,
    };
    return viewModel;
  }
}

export class MoneyTransactionsViewModel {
  @ApiProperty()
  id: string;
  @ApiProperty()
  fromWalletId: string;
  @ApiProperty()
  toWalletId: string;
  @ApiProperty()
  withdrawalAmount: number;
  @ApiProperty()
  depositedAmount: number;
}
