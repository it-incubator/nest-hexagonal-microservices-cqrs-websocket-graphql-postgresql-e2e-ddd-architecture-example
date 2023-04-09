import { EntityManagerWrapper } from '../../features/clients/db/entityManagerWrapper';
import { DataSource } from 'typeorm';

const entityManagerProvider = () => ({
  // scope: Scope.REQUEST,
  provide: EntityManagerWrapper,
  async useFactory(dataSource: DataSource) {
    const queryRunner = dataSource.createQueryRunner();
    const wrapper = new EntityManagerWrapper(queryRunner);
    return wrapper;
  },
  inject: [DataSource],
});
