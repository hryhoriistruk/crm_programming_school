import { OrderStatusStatistics } from '../types/order-status-statistics.type';

export interface OrderStatistics {
  managerId?: number;
  statuses: OrderStatusStatistics;
  total: number;
}
