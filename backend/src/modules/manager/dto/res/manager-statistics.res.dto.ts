import { ApiProperty } from '@nestjs/swagger';

import { OrderStatisticsResDto } from '../../../order/dto/res/order-statistics.res.dto';
import { PaginationResDto } from '../../../pagination/dto/res/pagination.res.dto';
import { ApiPaginatedManagerStatistics } from '../../decorators/api-paginated-manager-statistics.decorator';
import { ManagerWithOrderStatisticsResDto } from './manager-with-order-statistics.res.dto';

export class ManagerStatisticsResDto {
  @ApiPaginatedManagerStatistics()
  public readonly managers: PaginationResDto<ManagerWithOrderStatisticsResDto>;

  @ApiProperty({
    description: 'Order statistics',
    example: OrderStatisticsResDto,
  })
  public readonly orders_statistics: OrderStatisticsResDto;
}
