import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../../core/db/base.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from '../domain/entities/wallet.entity';

@Injectable()
export class WalletsRepository implements BaseRepository<Wallet> {
  constructor(
    @InjectRepository(Wallet)
    private ormRepo: Repository<Wallet>,
  ) {}

  async getById(id: string) {
    const entity = await this.ormRepo.findOneBy({ id: id });
    return entity;
  }

  async save(entity: Wallet) {
    await this.ormRepo.save(entity);
  }

  async delete(id: string) {
    await this.ormRepo.delete(id);
  }
}
