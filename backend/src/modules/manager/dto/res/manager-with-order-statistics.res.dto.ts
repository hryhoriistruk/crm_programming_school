import { ApiProperty } from '@nestjs/swagger';

import { OrderStatisticsResDto } from '../../../order/dto/res/order-statistics.res.dto';
import { BaseManagerResDto } from './base-manager.res.dto';

export class ManagerWithOrderStatisticsResDto extends BaseManagerResDto {
  @ApiProperty({
    description: 'Order statistics',
    example: OrderStatisticsResDto,
  })
  public readonly orders_statistics: OrderStatisticsResDto;
}
