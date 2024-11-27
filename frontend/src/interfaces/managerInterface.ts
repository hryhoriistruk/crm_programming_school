import { EUserRole } from '../enums';
import { IOrderStatistics } from './orderStatisticsInterface';

export interface IManager {
    id: number;
    name: string;
    surname: string;
    email: string;
    is_active: boolean;
    last_login: Date;
    user_role: EUserRole;
}

export interface IManagerWithOrderStatistics extends IManager {
    orders_statistics: IOrderStatistics;
}

export type ICreateManager = Pick<IManager, 'name' | 'surname' | 'email'>;
