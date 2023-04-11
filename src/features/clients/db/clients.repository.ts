import { Client } from '../domain/entities/client/client.entity';
import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../../modules/core/db/base.repository';
import { StoreService } from '../store.service';

@Injectable()
export class ClientsRepository extends BaseRepository<Client> {
  constructor(public store: StoreService) {
    super(store, Client);
  }
}
