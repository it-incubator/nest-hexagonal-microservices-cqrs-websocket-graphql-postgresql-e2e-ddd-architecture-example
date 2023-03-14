import { Repository } from 'typeorm';
import { Client } from '../domain/entities/client.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ClientsRepository {
  constructor(
    @InjectRepository(Client)
    private clientsRepo: Repository<Client>,
  ) {}
  async getById(id: string) {
    const client = await this.clientsRepo.findOneBy({ id: id });
    return client;
  }

  async save(client: Client) {
    await this.clientsRepo.save(client);
  }
}
