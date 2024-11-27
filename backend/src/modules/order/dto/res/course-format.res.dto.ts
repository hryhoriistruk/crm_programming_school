import { ApiProperty } from '@nestjs/swagger';

import { ECourseFormat } from '../../../../database/entities/enums/course-format.enum';

export class CourseFormatResDto {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the course format.',
  })
  public readonly id: number;

  @ApiProperty({
    example: 'static',
    description: 'The format in which the course is delivered.',
  })
  public readonly format: ECourseFormat;
}
