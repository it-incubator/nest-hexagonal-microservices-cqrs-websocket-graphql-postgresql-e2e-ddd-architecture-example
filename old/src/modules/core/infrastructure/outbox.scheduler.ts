import { Injectable } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { OutboxRepository } from '../db/outbox.repository';
import { DeliveryStatus, OutboxEvent } from '../entities/outbox-event.entity';
import { SortDirection } from '../db/base.repository';
import { CronJob } from 'cron';

const OUTBOX_SCHEDULER_JOB_NAME = 'OUTBOX_SCHEDULER_JOB_NAME';

@Injectable()
export class OutboxScheduler {
  // private readonly logger = new Logger(TasksService.name);
  private job: CronJob;

  constructor(
    protected outboxRepository: OutboxRepository,
    schedulerRegistry: SchedulerRegistry,
  ) {
    this.job = schedulerRegistry.getCronJob(OUTBOX_SCHEDULER_JOB_NAME);
  }

  @Cron(CronExpression.EVERY_SECOND, {
    name: OUTBOX_SCHEDULER_JOB_NAME,
  })
  async handleCron(): Promise<void> {
    this.job.stop();
    const pendingMessages = await this.outboxRepository.getMany(
      {
        status: DeliveryStatus.Pending,
      },
      {
        sortBy: [{ propertyName: 'createdAt', direction: SortDirection.ASC }],
        lock: false,
      },
    );

    for (let i = 0; i < pendingMessages.length; i++) {
      await this.sendToRabbit(pendingMessages[i]);
      pendingMessages[i].status = DeliveryStatus.Delivered;
      await this.outboxRepository.save(pendingMessages[i]);
    }
    this.job.start();
  }

  private sendToRabbit(pendingMessage: OutboxEvent<any>) {
    return Promise.resolve();
  }
}
