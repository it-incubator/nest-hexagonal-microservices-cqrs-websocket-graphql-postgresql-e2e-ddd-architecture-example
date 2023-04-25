import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { BaseQueryRepository } from '../../../modules/core/db/base.query.repository';
import { Wallet } from '../domain/entities/wallet.entity';

@Injectable()
export class WalletsQueryRepository
  implements BaseQueryRepository<WalletViewModel>
{
  constructor(
    @InjectRepository(Wallet)
    private ormRepo: Repository<Wallet>,
  ) {}

  async getAll(): Promise<WalletViewModel[]> {
    const clients = await this.ormRepo.find({});
    return clients.map(WalletsQueryRepository.mapEntityToViewModel);
  }

  async getById(id: string): Promise<WalletViewModel | null> {
    const entity = await this.ormRepo.findOneBy({
      id: id,
    });
    if (!entity) return null;
    return WalletsQueryRepository.mapEntityToViewModel(entity);
  }

  static mapEntityToViewModel(entity: Wallet): WalletViewModel {
    return {
      id: entity.id,
      title: entity.title,
      balance: entity.balance,
    };
  }
}

export class WalletViewModel {
  @ApiProperty()
  id: string;
  @ApiProperty()
  title: string;
  @ApiProperty()
  balance: number;
}
