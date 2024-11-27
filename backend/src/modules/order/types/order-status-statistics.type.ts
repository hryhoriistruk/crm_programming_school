import { EOrderStatus } from '../../../database/entities/enums/order-status.enum';

export type OrderStatusStatistics = Record<EOrderStatus, number>;
