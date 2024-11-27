import { ApiProperty } from '@nestjs/swagger';

export class OrderStatisticsResDto {
  @ApiProperty({ description: 'Total number of orders', example: 500 })
  public readonly total: number;

  @ApiProperty({
    description: 'Number of orders in "In work" status',
    example: 480,
  })
  public readonly inWork: number;

  @ApiProperty({
    description: 'Number of orders in "Agree" status',
    example: 7,
  })
  public readonly agree: number;

  @ApiProperty({
    description: 'Number of orders in "Disagree" status',
    example: 3,
  })
  public readonly disagree: number;

  @ApiProperty({
    description: 'Number of orders in "Dubbing" status',
    example: 1,
  })
  public readonly dubbing: number;

  @ApiProperty({ description: 'Number of orders in "New" status', example: 9 })
  public readonly new: number;
}
