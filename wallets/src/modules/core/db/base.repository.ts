import { BaseDomainEntity } from '../entities/baseDomainEntity';
import { StoreService } from '../infrastructure/store.service';

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

  async getById(id: string, options: { lock: boolean } = { lock: true }) {
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
    options: {
      lock: /*todo: ?*/ boolean;
      sortBy: /* todo: ?*/ SortProperty<keyof T>[];
    } = {
      lock: false,
      sortBy: [],
    },
  ) {
    // todo: process defaults separatly

    let selectQueryBuilder = this.getRepository().createQueryBuilder();
    if (options.lock) {
      selectQueryBuilder = selectQueryBuilder.setLock('pessimistic_write');
    }
    selectQueryBuilder = selectQueryBuilder.where(filter);

    // todo: support case for many properties
    if (options.sortBy.length > 0) {
      selectQueryBuilder = selectQueryBuilder.orderBy(
        options.sortBy[0].propertyName as string,
        options.sortBy[0].direction,
      );
    }

    const entities = await selectQueryBuilder.getMany();
    return entities;
  }

  async save(...entity: T[]) {
    await this.getRepository().save(entity);
  }


  async delete(id: string) {
    await this.getRepository().delete(id);
  }

  protected getRepository() {
    return this.store.getStore().managerWrapper.getRepository<T>(this._class);
  }
}

export type SortProperty<TPropertyName> = {
  propertyName: TPropertyName;
  direction: SortDirection;
};

export enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

class Man {
  public address: string;
  public age: string;
}

const propName: keyof Man = 'address';
