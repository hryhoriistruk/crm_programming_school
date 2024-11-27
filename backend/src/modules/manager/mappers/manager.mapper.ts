import { ManagerEntity } from '../../../database/entities/manager.entity';
import { OrderStatistics } from '../../order/interfaces/order-statistics.interface';
import { OrderMapper } from '../../order/mappers/order.mapper';
import { PaginationResDto } from '../../pagination/dto/res/pagination.res.dto';
import { BaseManagerResDto } from '../dto/res/base-manager.res.dto';
import { ManagerWithOrderStatisticsResDto } from '../dto/res/manager-with-order-statistics.res.dto';

export class ManagerMapper {
  public static toDto(entity: ManagerEntity): BaseManagerResDto {
    return {
      id: entity.id,
      email: entity.email,
      name: entity.name,
      surname: entity.surname,
      is_active: entity.is_active,
      last_login: entity.last_login,
      user_role: entity.user_role,
    };
  }
  public static toManagerWithOrderStatisticsDto(
    entity: ManagerEntity,
    statistic: OrderStatistics,
  ): ManagerWithOrderStatisticsResDto {
    return {
      id: entity.id,
      email: entity.email,
      name: entity.name,
      surname: entity.surname,
      is_active: entity.is_active,
      last_login: entity.last_login,
      user_role: entity.user_role,
      orders_statistics: OrderMapper.toOrderStatisticsDto(statistic),
    };
  }
  public static toListDto(
    paginationData: PaginationResDto<ManagerEntity>,
    statistics: OrderStatistics[],
  ): PaginationResDto<ManagerWithOrderStatisticsResDto> {
    const data = paginationData.data.map((entity) => {
      const stat = statistics.find(
        (statistic) => statistic.managerId === entity.id,
      );
      return this.toManagerWithOrderStatisticsDto(entity, stat);
    });
    return {
      data,
      totalCount: paginationData.totalCount,
      page: paginationData.page,
      limit: paginationData.limit,
    };
  }
}
