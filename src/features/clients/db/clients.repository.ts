import { Repository } from 'typeorm';
import { Client } from '../domain/entities/client.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

export interface BaseRepository<T> {
  getById(id: string): Promise<T>;

  save(client: T): Promise<void>;

  delete(id: string): Promise<void>;
}

@Injectable()
export class ClientsRepository implements BaseRepository<Client> {
  constructor(
    @InjectRepository(Client)
    private ormClientsRepo: Repository<Client>,
  ) {}

  async getById(id: string) {
    const client = await this.ormClientsRepo.findOneBy({ id: id });
    return client;
  }

  async save(client: Client) {
    await this.ormClientsRepo.save(client);
  }

  async delete(id: string) {
    await this.ormClientsRepo.delete(id);
  }
}
