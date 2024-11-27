import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { OrderStatusEntity } from '../../../database/entities/order-status.entity';

@Injectable()
export class OrderStatusRepository extends Repository<OrderStatusEntity> {
  constructor(private readonly datasource: DataSource) {
    super(OrderStatusEntity, datasource.manager);
  }
}
