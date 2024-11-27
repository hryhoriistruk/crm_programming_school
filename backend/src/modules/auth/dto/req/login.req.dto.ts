import { PickType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

import { TransformHelper } from '../../../../common/helpers/transform.helper';
import { BaseAuthReqDto } from './base-auth.req.dto';

export class LoginReqDto extends PickType(BaseAuthReqDto, [
  'email',
  'password',
  'deviceId',
]) {
  @Transform(TransformHelper.trim)
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  password: string;
}
