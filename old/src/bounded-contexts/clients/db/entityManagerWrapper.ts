import { ObjectLiteral, QueryRunner, Repository } from 'typeorm';

export class EntityManagerWrapper {
  constructor(public queryRunner: QueryRunner) {}

  // todo: why we need this repos...
  private repos: Repository<any>[] = [];

  public getRepository<T extends ObjectLiteral>(_class: any): Repository<T> {
    const repo = this.queryRunner.manager.getRepository<T>(_class);
    this.repos.push(repo);
    return repo;
  }
}
