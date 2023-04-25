import { StoreService } from './store.service';
import { EventBus } from '@nestjs/cqrs';
import { OutboxRepository } from '../db/outbox.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BaseUseCaseServicesWrapper {
  public constructor(
    public readonly store: StoreService,
    public eventBus: EventBus,
    public outboxRepository: OutboxRepository,
  ) {}
}
