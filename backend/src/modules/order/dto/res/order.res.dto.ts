import { ApiProperty } from '@nestjs/swagger';

import { ECourse } from '../../../../database/entities/enums/course.enum';
import { ECourseFormat } from '../../../../database/entities/enums/course-format.enum';
import { ECourseType } from '../../../../database/entities/enums/course-type.enum';
import { EOrderStatus } from '../../../../database/entities/enums/order-status.enum';
import { CommentResDto } from './comment.res.dto';

export class OrderResDto {
  @ApiProperty({
    example: 1,
    description: 'The unique identifier of the Order',
  })
  public readonly id: number;

  @ApiProperty({
    example: 'Ivan',
    description: 'The first name of the customer',
  })
  public readonly name: string;

  @ApiProperty({
    example: 'Ivanov',
    description: 'The surname of the customer',
  })
  public readonly surname: string;

  @ApiProperty({
    example: 'ivan@gmail.com',
    description: 'The email address of the customer',
  })
  public readonly email: string;

  @ApiProperty({
    example: '+380 12 345 67 89',
    description: 'The phone number of the customer',
  })
  public readonly phone: string;

  @ApiProperty({
    example: 30,
    description: 'The age of the customer',
  })
  public readonly age: number;

  @ApiProperty({
    example: 'FS',
    description: 'The course the customer is enrolled in',
    enum: ECourse,
  })
  public readonly course: ECourse;

  @ApiProperty({
    example: 'online',
    description: 'The format of the course',
    enum: ECourseFormat,
  })
  public readonly course_format: ECourseFormat;

  @ApiProperty({
    example: 'vip',
    description: 'The type of the course',
    enum: ECourseType,
  })
  public readonly course_type: ECourseType;

  @ApiProperty({
    example: 'New',
    description: 'The status of the order',
    enum: EOrderStatus,
  })
  public readonly status: EOrderStatus;

  @ApiProperty({
    example: 5000,
    description: 'Total cost of the course',
  })
  public readonly sum: number;

  @ApiProperty({
    example: 1000,
    description: 'The amount already paid by the customer',
  })
  public readonly alreadyPaid: number;

  @ApiProperty({
    example: '2024-08-12T15:29:59.200Z',
    description: 'The creation date of the order',
  })
  public readonly created_at: Date;

  @ApiProperty({
    example: 'utm_source=google&utm_medium=cpc&utm_campaign=summer_sale',
    description: 'The UTM parameters associated with the order',
  })
  public readonly utm: string;

  @ApiProperty({
    example: 'Please deliver the course materials before the end of the month.',
    description: 'A message or note associated with the order',
  })
  public readonly msg: string;

  @ApiProperty({
    example: 'Katerina',
    description: 'The name of the manager handling the order',
  })
  public readonly manager_name: string;

  @ApiProperty({
    example: 'sept-2023',
    description: 'The group name the customer belongs to',
  })
  public readonly group_name: string;

  @ApiProperty({ type: [CommentResDto] })
  public readonly comments: CommentResDto[];
}
