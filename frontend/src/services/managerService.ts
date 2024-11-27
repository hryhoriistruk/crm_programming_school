import { IManager, IManagerStatistics, IQuery } from '../interfaces';
import { ApiResponse } from '../types';
import { apiService } from './apiService';
import { urls } from '../constants';

const managerService = {
    getManagersAndOrdersStatistics: (
        query: IQuery
    ): ApiResponse<IManagerStatistics> =>
        apiService.get(urls.managers.base, { params: query }),
    getMe: (): ApiResponse<IManager> => apiService.get(urls.managers.me),
};

export { managerService };
