import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

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
