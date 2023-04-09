import { QueryRunner, Repository } from 'typeorm';

export class EntityManagerWrapper {
  constructor(public queryRunner: QueryRunner) {}

  private repos: Repository<any>[] = [];

  public getRepository<T>(_class: any): Repository<T> {
    const repo = this.queryRunner.manager.getRepository<T>(_class);
    this.repos.push(repo);
    return repo;
  }
}
