import { DomainResultNotification } from '../validation/notification';
import { DeliveryStatus, OutboxEvent } from '../entities/outbox-event.entity';
import { BaseUseCaseServicesWrapper } from '../infrastructure/BaseUseCaseServicesWrapper';
import { randomUUID } from 'crypto';

export abstract class BaseUsecase<
  TInputCommand,
  TOutputResultNotificationData,
> {
  protected constructor(
    private readonly baseUseCaseServicesWrapper: BaseUseCaseServicesWrapper,
  ) {}

  // this function will contain all of the operations that you need to perform
  // and has to be implemented in all transaction classes
  protected abstract onExecute(
    command: TInputCommand,
  ): Promise<DomainResultNotification<TOutputResultNotificationData>>;

  async execute(
    command: TInputCommand,
  ): Promise<DomainResultNotification<TOutputResultNotificationData>> {
    return await this.runWithTransaction(command);
  }

  // this is the providers function that runs the transaction
  private async runWithTransaction(
    data: TInputCommand,
  ): Promise<DomainResultNotification<TOutputResultNotificationData>> {
    // since everything in Nest.js is a singleton we should create a separate
    // QueryRunner instance for each call
    const queryRunner =
      this.baseUseCaseServicesWrapper.store.getStore().managerWrapper
        .queryRunner;
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const resultNotification = await this.onExecute(data);
      if (resultNotification.hasError()) {
        await queryRunner.rollbackTransaction();
      } else {
        const eventsSavingPromises = resultNotification.events.map((e) => {
          const event = new OutboxEvent();
          event.id = randomUUID();
          event.serviceName = 'shop'; // from Config
          event.status = DeliveryStatus.Pending; // from Config
          event.data = e; // from Config
          event.eventName = e.constructor.name; // todo: name in Event as porperty
          return this.baseUseCaseServicesWrapper.outboxRepository.save(event);
        });
        await Promise.all(eventsSavingPromises);
        await queryRunner.commitTransaction();
        resultNotification.events.forEach((e) =>
          this.baseUseCaseServicesWrapper.eventBus.publish(e),
        );
      }
      return resultNotification;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      console.error(error);
      throw new Error('Transaction failed');
    } finally {
      await queryRunner.release();
    }
  }

  // this is a function that allows us to use other "transaction" classes
  // inside of any other "providers" transaction, i.e. without creating a new DB transaction
  /*  async runWithoutTransaction(
    data: TInputCommand,
    manager: EntityManager,
  ): Promise<TOutputResult> {
    return this.onExecute(data, manager);
  }*/
}
