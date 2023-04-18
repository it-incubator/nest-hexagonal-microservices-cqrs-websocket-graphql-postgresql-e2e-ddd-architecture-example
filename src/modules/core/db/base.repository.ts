import { BaseDomainEntity } from '../entities/baseDomainEntity';
import { StoreService } from '../../../features/clients/store.service';

/*export interface BaseRepository<T> {
  getById(id: string): Promise<T>;

  save(client: T): Promise<void>;

  delete(id: string): Promise<void>;
}*/

export class BaseRepository<T extends BaseDomainEntity> {
  // protected ormRepo: Repository<T>;
  constructor(
    //public managerWrapper: EntityManagerWrapper,
    public store: StoreService,
    protected _class: any,
  ) {
    // this.ormRepo = managerWrapper.getRepository<T>(_class);
  }

  async getById(id: string, options: { lock: boolean } = { lock: false }) {
    if (!id) {
      throw new Error('Repository Error: id should be defined for getById');
    }
    let selectQueryBuilder = this.getRepository().createQueryBuilder();

    if (options.lock) {
      //FIXME: An open transaction is required for pessimistic lock.
      selectQueryBuilder = selectQueryBuilder.setLock('pessimistic_write');
    }
    const entity = await selectQueryBuilder.where({ id: id }).getOneOrFail();
    return entity;
  }

  async getMany(
    filter: Partial<T>,
    options: { lock: boolean } = { lock: false },
  ) {
    let selectQueryBuilder = this.getRepository().createQueryBuilder();
    if (options.lock) {
      selectQueryBuilder = selectQueryBuilder.setLock('pessimistic_write');
    }
    const entities = await selectQueryBuilder.where(filter).getMany();
    return entities;
  }

  async save(entity: T) {
    await this.getRepository().save(entity);
  }

  async delete(id: string) {
    await this.getRepository().delete(id);
  }

  private getRepository() {
    return this.store.getStore().managerWrapper.getRepository<T>(this._class);
  }
}
