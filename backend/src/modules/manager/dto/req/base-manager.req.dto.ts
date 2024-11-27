import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

import { TransformHelper } from '../../../../common/helpers/transform.helper';

export class BaseManagerReqDto {
  @Transform(TransformHelper.trim)
  @Type(() => String)
  @IsString()
  @Length(1, 25)
  @IsNotEmpty()
  @ApiProperty({ example: 'Ivan' })
  name: string;

  @Transform(TransformHelper.trim)
  @Type(() => String)
  @IsString()
  @Length(1, 25)
  @IsNotEmpty()
  @ApiProperty({ example: 'Ivanov' })
  surname: string;

  @Transform(TransformHelper.trim)
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%_])(?=\S+$).{8,}$/, {
    message:
      'Password must have minimum 8 characters,include one lowercase letter, one uppercase letter, one digit, and one non-alphanumeric character (e.g., @, #, $, %, or _), and no whitespace',
  })
  @ApiProperty({ example: 'Abcdef1@' })
  password: string;

  @Transform(TransformHelper.trim)
  @Transform(TransformHelper.toLowerCase)
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  @Matches(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/, {
    message:
      'Email address must be in a valid format (Example: user@gmail.com)',
  })
  @ApiProperty({ example: 'user@gmail.com' })
  email: string;
}
