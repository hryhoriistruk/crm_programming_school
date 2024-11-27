import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { EOrderStatus } from '../../../database/entities/enums/order-status.enum';
import { OrderEntity } from '../../../database/entities/order.entity';
import { OrderStatistics } from '../../order/interfaces/order-statistics.interface';
import { OrderStatusStatistics } from '../../order/types/order-status-statistics.type';

@Injectable()
export class OrderRepository extends Repository<OrderEntity> {
  constructor(private readonly dataSource: DataSource) {
    super(OrderEntity, dataSource.manager);
  }

  public async getStatistics(id?: number): Promise<OrderStatistics> {
    const qb = this.createQueryBuilder('order')
      .select([
        "CASE WHEN order.status IS NULL THEN 'New' ELSE order.status END AS status",
        'COUNT(*) AS count',
      ])
      .groupBy(
        "CASE WHEN order.status IS NULL THEN 'New' ELSE order.status END",
      );
    if (id) {
      qb.where('order.manager_id = :id', { id });
    }
    const statusCounts = await qb.getRawMany();
    const total = statusCounts.reduce(
      (sum, record) => sum + Number(record.count),
      0,
    );

    const defaultStatuses: OrderStatusStatistics = {
      [EOrderStatus.IN_WORK]: 0,
      [EOrderStatus.NEW]: 0,
      [EOrderStatus.AGREE]: 0,
      [EOrderStatus.DISAGREE]: 0,
      [EOrderStatus.DUBBING]: 0,
    };

    return {
      managerId: id ? id : null,
      total,
      statuses: statusCounts.reduce((acc, record) => {
        acc[record.status] = Number(record.count);
        return acc;
      }, defaultStatuses),
    };
  }
}
