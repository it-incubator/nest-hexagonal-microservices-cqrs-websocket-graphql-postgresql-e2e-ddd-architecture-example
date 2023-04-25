import { Column, Entity } from 'typeorm';
import { BaseDomainEntity } from './baseDomainEntity';

export enum DeliveryStatus {
  Pending = 0, //'pending',
  Delivered = 1, //'delivered',
}

@Entity()
export class OutboxEvent<T> extends BaseDomainEntity {
  @Column({
    type: 'jsonb',
  })
  public data: T;
  @Column()
  public serviceName: string;
  @Column({
    nullable: true,
    type: 'uuid',
  })
  public traceId: string | null;
  @Column({
    type: 'enum',
    enum: DeliveryStatus,
  })
  public status: DeliveryStatus;
  @Column()
  public eventName: string;
}
