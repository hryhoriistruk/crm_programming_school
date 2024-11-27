import { Column, Entity, OneToMany } from 'typeorm';

import { ETableName } from './enums/table-name.enum';
import { BaseModel } from './models/base.model';
import { OrderEntity } from './order.entity';

@Entity(ETableName.GROUPS)
export class GroupEntity extends BaseModel {
  @Column({ type: 'varchar', length: 30, unique: true })
  name: string;

  @OneToMany(() => OrderEntity, (entity) => entity.group)
  orders?: OrderEntity[];
}
