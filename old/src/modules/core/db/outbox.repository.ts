import { StoreService } from '../infrastructure/store.service';
import { OutboxEvent } from '../entities/outbox-event.entity';
import { BaseRepository } from './base.repository';
import { Injectable } from '@nestjs/common';

/*export interface BaseRepository<T> {
  getById(id: string): Promise<T>;

  save(client: T): Promise<void>;

  delete(id: string): Promise<void>;
}*/

@Injectable()
export class OutboxRepository extends BaseRepository<OutboxEvent<any>> {
  constructor(public store: StoreService) {
    super(store, OutboxEvent);
  }
}
