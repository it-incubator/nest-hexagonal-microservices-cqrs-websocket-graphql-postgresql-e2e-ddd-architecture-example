import { CreateDateColumn, PrimaryColumn, UpdateDateColumn } from 'typeorm';

export class BaseDomainEntity {
  @PrimaryColumn('uuid')
  public id: string;
  @CreateDateColumn()
  public createdAt: Date;
  @UpdateDateColumn()
  public updatedAt: Date;
  public createBy: string;
  public updateBy: string;
}
