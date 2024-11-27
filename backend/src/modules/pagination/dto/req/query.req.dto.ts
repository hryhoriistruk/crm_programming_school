import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsOptional,
  IsString,
  Validate,
} from 'class-validator';

import { TimeHelper } from '../../../../common/helpers/time.helper';
import { TransformHelper } from '../../../../common/helpers/transform.helper';
import { IsValidOrderField } from '../../../../common/validators/is-valid-order-field.validator';
import { ECourse } from '../../../../database/entities/enums/course.enum';
import { ECourseFormat } from '../../../../database/entities/enums/course-format.enum';
import { ECourseType } from '../../../../database/entities/enums/course-type.enum';
import { EOrderStatus } from '../../../../database/entities/enums/order-status.enum';
import { ValidatedInteger } from '../../../order/decorators/validated-integer.decorator';
import { ValidatedTrimmedString } from '../../../order/decorators/validated-trimmed-string.decorator';
import {
  EOrderFieldsAsc,
  EOrderFieldsDesc,
} from '../../models/enums/order-fields.enum';
import { BasePaginationReqDto } from './base-pagination.req.dto';

export class QueryReqDto extends BasePaginationReqDto {
  @ApiProperty({
    required: false,
    default: EOrderFieldsDesc.ID,
    enum: [
      ...Object.values(EOrderFieldsAsc),
      ...Object.values(EOrderFieldsDesc),
    ],
    description:
      'Use a "-" before the field name for descending order (e.g., "-id" for descending order by ID)',
  })
  @IsString()
  @IsOptional()
  @Validate(IsValidOrderField)
  order?: EOrderFieldsDesc | EOrderFieldsAsc = EOrderFieldsDesc.ID;

  @ValidatedTrimmedString()
  @IsOptional()
  @Transform(TransformHelper.toLowerCase)
  @ApiProperty({
    required: false,
  })
  name?: string;

  @ValidatedTrimmedString()
  @IsOptional()
  @Transform(TransformHelper.toLowerCase)
  @ApiProperty({
    required: false,
  })
  surname?: string;

  @ValidatedTrimmedString()
  @IsOptional()
  @Transform(TransformHelper.toLowerCase)
  @ApiProperty({
    required: false,
  })
  email?: string;

  @ValidatedTrimmedString()
  @IsOptional()
  @ApiProperty({
    required: false,
  })
  phone?: string;

  @ValidatedInteger()
  @Type(() => Number)
  @IsOptional()
  @ApiProperty({
    required: false,
  })
  age?: number;

  @IsOptional()
  @IsString()
  @IsEnum(EOrderStatus, {
    message: `Entered order status must be one of the following values: ${Object.values(EOrderStatus)}`,
  })
  @ApiProperty({ required: false })
  status?: EOrderStatus;

  @IsOptional()
  @IsString()
  @IsEnum(ECourse, {
    message: `Entered course must be one of the following values: ${Object.values(ECourse)}`,
  })
  @ApiProperty({ required: false })
  course?: ECourse;

  @IsOptional()
  @IsString()
  @IsEnum(ECourseFormat, {
    message: `Entered course format must be one of the following values: ${Object.values(ECourseFormat)}`,
  })
  @ApiProperty({ required: false })
  course_format?: ECourseFormat;

  @IsOptional()
  @IsString()
  @IsEnum(ECourseType, {
    message: `Entered course type must be one of the following values: ${Object.values(ECourseType)}`,
  })
  @ApiProperty({ required: false })
  course_type?: ECourseType;

  @ValidatedInteger()
  @IsOptional()
  @ApiProperty({
    example: 1,
    required: false,
  })
  group?: number;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @ApiProperty({
    required: false,
  })
  start_date?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @Transform(TimeHelper.setHoursForEndDate)
  @ApiProperty({
    required: false,
  })
  end_date?: Date;

  @ValidatedTrimmedString()
  @IsOptional()
  @Transform(TransformHelper.toLowerCase)
  @ApiProperty({
    required: false,
  })
  manager?: string;
}
