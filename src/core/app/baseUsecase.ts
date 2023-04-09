import { DataSource } from 'typeorm';
import { StoreService } from '../../features/clients/store.service';

export abstract class BaseUsecase<TInputCommand, TOutputResult> {
  protected constructor(private readonly store: StoreService) {}

  // this function will contain all of the operations that you need to perform
  // and has to be implemented in all transaction classes
  protected abstract onExecute(command: TInputCommand): Promise<TOutputResult>;

  /*
  protected setManager(
    manager: EntityManagerWrapper,
    ...repos: BaseRepository<BaseDomainEntity>[]
  ) {
    repos.forEach((r) => r.setManager(manager));
  }
*/

  async truncateDBTables(connection: DataSource): Promise<void> {
    const entities = connection.entityMetadatas;
    for (const entity of entities) {
      const repository = connection.getRepository(entity.name);
      await repository.query(`TRUNCATE TABLE "${entity.tableName}" CASCADE;`);
    }
  }

  async execute(command: TInputCommand): Promise<TOutputResult> {
    return await this.runWithTransaction(command);
  }

  /* private createRunner(): QueryRunner {
    return this.wrapper.dataSource.createQueryRunner();
  }*/

  // this is the providers function that runs the transaction
  private async runWithTransaction(
    data: TInputCommand,
  ): Promise<TOutputResult> {
    // since everything in Nest.js is a singleton we should create a separate
    // QueryRunner instance for each call
    const queryRunner = this.store.getStore().managerWrapper.queryRunner;
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const result = await this.onExecute(data);
      await queryRunner.commitTransaction();
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
