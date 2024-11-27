import { ApiProperty } from '@nestjs/swagger';

export class GroupResDto {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the group',
  })
  public readonly id: number;

  @ApiProperty({
    example: 'sept-2024',
    description: 'The group name',
  })
  public readonly name: string;
}
