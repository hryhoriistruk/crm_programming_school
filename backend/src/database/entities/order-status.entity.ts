import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { EOrderStatus } from './enums/order-status.enum';
import { ETableName } from './enums/table-name.enum';

@Entity({ name: ETableName.ORDER_STATUS })
export class OrderStatusEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'enum', enum: EOrderStatus })
  status: EOrderStatus;
}
