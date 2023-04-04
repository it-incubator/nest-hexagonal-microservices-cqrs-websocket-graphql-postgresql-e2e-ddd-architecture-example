import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../../core/db/base.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MoneyTransaction } from '../domain/entities/money-transaction.entity';

@Injectable()
export class MoneyTransactionsRepository
  implements BaseRepository<MoneyTransaction>
{
  constructor(
    @InjectRepository(MoneyTransaction)
    private ormRepo: Repository<MoneyTransaction>,
  ) {}

  async getById(id: string) {
    const entity = await this.ormRepo.findOneBy({ id: id });
    return entity;
  }

  async save(entity: MoneyTransaction) {
    await this.ormRepo.save(entity);
  }

  async delete(id: string) {
    await this.ormRepo.delete(id);
  }
}
