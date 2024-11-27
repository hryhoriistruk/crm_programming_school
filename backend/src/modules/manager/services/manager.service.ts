import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';

import { ManagerEntity } from '../../../database/entities/manager.entity';
import { IUserData } from '../../auth/interfaces/user-data.interface';
import { OrderMapper } from '../../order/mappers/order.mapper';
import { OrderService } from '../../order/services/order.service';
import { QueryReqDto } from '../../pagination/dto/req/query.req.dto';
import { PaginationService } from '../../pagination/services/pagination.service';
import { BaseManagerResDto } from '../dto/res/base-manager.res.dto';
import { ManagerStatisticsResDto } from '../dto/res/manager-statistics.res.dto';
import { ManagerMapper } from '../mappers/manager.mapper';

@Injectable()
export class ManagerService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly orderService: OrderService,
    private readonly paginationService: PaginationService,
  ) {}

  public async getMe(userData: IUserData): Promise<BaseManagerResDto> {
    return await this.entityManager.transaction(async (entityManager) => {
      const managerRepository = entityManager.getRepository(ManagerEntity);

      const manager = await managerRepository.findOneBy({
        id: userData.userId,
      });
      return ManagerMapper.toDto(manager);
    });
  }

  public async getManagersAndOrdersStatistics(
    userData: IUserData,
    query: QueryReqDto,
  ): Promise<ManagerStatisticsResDto> {
    return await this.entityManager.transaction(async (entityManager) => {
      const managerRepository = entityManager.getRepository(ManagerEntity);

      const statistics = await this.orderService.getOrdersStatistics();

      const managers = await this.paginationService.paginate(
        query,
        managerRepository,
        [],
        userData.userId,
      );
      const managersOrdersStatistics = await Promise.all(
        managers.data.map(async (manager) => {
          return await this.orderService.getOrdersStatisticsByManagerId(
            manager.id,
          );
        }),
      );

      const mappedManagers = ManagerMapper.toListDto(
        managers,
        managersOrdersStatistics,
      );

      return {
        managers: mappedManagers,
        orders_statistics: OrderMapper.toOrderStatisticsDto(statistics),
      };
    });
  }
}
