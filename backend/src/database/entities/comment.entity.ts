import { Column, Entity, ManyToOne } from 'typeorm';

import { ETableName } from './enums/table-name.enum';
import { ManagerEntity } from './manager.entity';
import { BaseModel } from './models/base.model';
import { OrderEntity } from './order.entity';

@Entity({ name: ETableName.COMMENTS })
export class CommentEntity extends BaseModel {
  @Column({ type: 'text' })
  text: string;

  @ManyToOne(() => OrderEntity, (entity) => entity.comments, {
    onDelete: 'CASCADE',
  })
  order?: OrderEntity;

  @ManyToOne(() => ManagerEntity, (entity) => entity.comments)
  manager?: ManagerEntity;
}
