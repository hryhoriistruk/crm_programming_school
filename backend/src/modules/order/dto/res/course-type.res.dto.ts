import { ApiProperty } from '@nestjs/swagger';

import { ECourseType } from '../../../../database/entities/enums/course-type.enum';

export class CourseTypeResDto {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the course type',
  })
  public readonly id: number;

  @ApiProperty({
    example: 'minimal',
    description: 'The type of course',
  })
  public readonly type: ECourseType;
}
