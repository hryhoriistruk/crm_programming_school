import { IPaginationRes } from './paginationResInterface';
import { IOrderStatistics } from './orderStatisticsInterface';
import { IManagerWithOrderStatistics } from './managerInterface';

export interface IManagerStatistics {
    managers: IPaginationRes<IManagerWithOrderStatistics>;
    orders_statistics: IOrderStatistics;
}
