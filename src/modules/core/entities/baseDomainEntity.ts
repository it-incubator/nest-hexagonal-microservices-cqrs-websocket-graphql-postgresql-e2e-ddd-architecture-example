import { CreateDateColumn, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { AggregateRoot } from '@nestjs/cqrs';

export class BaseDomainEntity {
  @PrimaryColumn('uuid')
  public id: string;
  @CreateDateColumn()
  public createdAt: string;
  @UpdateDateColumn()
  public updatedAt: string;
  public createBy: string;
  public updateBy: string;
}

export class BaseDomainAggregateRootEntity extends AggregateRoot {
  @PrimaryColumn('uuid')
  public id: string;
  @CreateDateColumn()
  public createdAt: string;
  @UpdateDateColumn()
  public updatedAt: string;
  public createBy: string;
  public updateBy: string;
}
