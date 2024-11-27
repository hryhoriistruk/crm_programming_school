import { ApiProperty } from '@nestjs/swagger';

export class CommentResDto {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the comment',
  })
  public readonly id: number;

  @ApiProperty({
    example: '2024-08-12T15:29:59.200Z',
    description: 'The creation date of the comment',
  })
  public readonly created_at: Date;

  @ApiProperty({
    example: 'Katerina',
    description: 'The name of the manager who wrote the comment',
  })
  public readonly manager_name: string;

  @ApiProperty({
    example: 'The user is thinking which course format to take',
    description: 'The text of the comment',
  })
  public readonly text: string;
}
