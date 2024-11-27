import { ApiProperty } from '@nestjs/swagger';

import { EOrderStatus } from '../../../../database/entities/enums/order-status.enum';

export class OrderStatusResDto {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the status',
  })
  public readonly id: number;

  @ApiProperty({
    example: 'In work',
    description: 'The status of the order.',
  })
  public readonly status: EOrderStatus;
}
