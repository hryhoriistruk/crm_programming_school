import { ApiProperty } from '@nestjs/swagger';

import { ECourse } from '../../../../database/entities/enums/course.enum';

export class CourseResDto {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the course',
  })
  public readonly id: number;

  @ApiProperty({
    example: 'QACX',
    description: 'The type of the course',
  })
  public readonly courseName: ECourse;
}
