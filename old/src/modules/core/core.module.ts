import { Global, Module } from '@nestjs/common';
import { SmtpAdapter } from './infrastructure/smtp.adapter';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OutboxEvent } from './entities/outbox-event.entity';
import { OutboxRepository } from './db/outbox.repository';
import { BaseUseCaseServicesWrapper } from './infrastructure/BaseUseCaseServicesWrapper';
import { StoreService } from './infrastructure/store.service';
import { ScheduleModule } from '@nestjs/schedule';
import { CqrsModule } from '@nestjs/cqrs';

@Global()
@Module({
  imports: [
    CqrsModule,
    TypeOrmModule.forFeature([OutboxEvent]),
    ScheduleModule.forRoot(),
  ],
  providers: [
    SmtpAdapter,
    OutboxRepository,
    StoreService,
    BaseUseCaseServicesWrapper,
  ],
  exports: [
    SmtpAdapter,
    BaseUseCaseServicesWrapper,
    StoreService,
    OutboxRepository,
  ],
})
export class CoreModule {}
