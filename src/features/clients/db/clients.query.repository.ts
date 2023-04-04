import { Repository } from 'typeorm';
import { Client } from '../domain/entities/client.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { BaseQueryRepository } from '../../../core/db/base.query.repository';

@Injectable()
export class ClientsQueryRepository
  implements BaseQueryRepository<ClientViewModel>
{
  constructor(
    @InjectRepository(Client)
    private ormRepo: Repository<Client>,
  ) {}

  async getAll(): Promise<ClientViewModel[]> {
    const clients = await this.ormRepo.find({});
    return clients.map(ClientsQueryRepository.mapClientEntityToClientViewModel);
  }

  async getById(id: string): Promise<ClientViewModel> {
    const entity = await this.ormRepo.findOneBy({
      id: id,
    });
    return ClientsQueryRepository.mapClientEntityToClientViewModel(entity);
  }

  static mapClientEntityToClientViewModel(client: Client): ClientViewModel {
    if (!client) return null;

    return {
      id: client.id,
      firstName: client.firstName,
      lastName: client.lastName,
      address: client.address,
    };
  }
}

export class ClientViewModel {
  @ApiProperty()
  id: string;
  @ApiProperty()
  firstName: string;
  @ApiProperty()
  lastName: string;
  @ApiProperty()
  address: string;
}
