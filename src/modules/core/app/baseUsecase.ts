import { StoreService } from '../../../features/clients/store.service';
import { EventBus } from '@nestjs/cqrs';
import { DomainResultNotification } from '../validation/notification';

export abstract class BaseUsecase<TInputCommand, TOutputResult> {
  protected constructor(
    private readonly store: StoreService,
    protected eventBus: EventBus,
  ) {}

  // this function will contain all of the operations that you need to perform
  // and has to be implemented in all transaction classes
  protected abstract onExecute(
    command: TInputCommand,
  ): Promise<DomainResultNotification<TOutputResult>>;

  async execute(
    command: TInputCommand,
  ): Promise<DomainResultNotification<TOutputResult>> {
    return await this.runWithTransaction(command);
  }

  // this is the providers function that runs the transaction
  private async runWithTransaction(
    data: TInputCommand,
  ): Promise<DomainResultNotification<TOutputResult>> {
    // since everything in Nest.js is a singleton we should create a separate
    // QueryRunner instance for each call
    const queryRunner = this.store.getStore().managerWrapper.queryRunner;
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const result = await this.onExecute(data);
      if (result.hasError()) {
        await queryRunner.rollbackTransaction();
      } else {
        await queryRunner.commitTransaction();
        result.events.forEach((e) => this.eventBus.publish(e));
      }
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();
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
