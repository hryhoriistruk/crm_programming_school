import { Column, Entity, OneToMany } from 'typeorm';

import { CommentEntity } from './comment.entity';
import { ETableName } from './enums/table-name.enum';
import { EUserRole } from './enums/user-role.enum';
import { BaseModel } from './models/base.model';
import { OrderEntity } from './order.entity';
import { RefreshTokenEntity } from './refresh-token.entity';

@Entity({ name: ETableName.MANAGERS })
export class ManagerEntity extends BaseModel {
  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text' })
  surname: string;

  @Column({ type: 'text' })
  email: string;

  @Column('text')
  password: string;

  @Column({ type: 'boolean', default: false })
  is_active: boolean;

  @Column({
    type: 'datetime',
    precision: 6,
    nullable: true,
  })
  last_login: Date;

  @Column({ type: 'enum', enum: EUserRole })
  user_role: EUserRole;

  @OneToMany(() => OrderEntity, (entity) => entity.manager)
  orders?: OrderEntity[];

  @OneToMany(() => RefreshTokenEntity, (entity) => entity.manager)
  refreshTokens?: RefreshTokenEntity[];

  @OneToMany(() => CommentEntity, (entity) => entity.manager)
  comments?: CommentEntity[];
}
