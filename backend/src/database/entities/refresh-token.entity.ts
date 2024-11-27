import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { ETableName } from './enums/table-name.enum';
import { ManagerEntity } from './manager.entity';
import { BaseModel } from './models/base.model';

@Entity({ name: ETableName.REFRESH_TOKENS })
export class RefreshTokenEntity extends BaseModel {
  @Column('text')
  refreshToken: string;

  @Column('text')
  deviceId: string;

  @Column()
  manager_id: number;

  @ManyToOne(() => ManagerEntity, (entity) => entity.refreshTokens)
  @JoinColumn({ name: 'manager_id' })
  manager?: ManagerEntity;
}
