import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsString, Length } from 'class-validator';

import { TransformHelper } from '../../../../common/helpers/transform.helper';

export class CommentReqDto {
  @IsNotEmpty()
  @Type(() => String)
  @IsString()
  @Length(1, 50)
  @Transform(TransformHelper.trim)
  @ApiProperty({
    example: 'The user is thinking which course format to take',
  })
  text: string;
}
