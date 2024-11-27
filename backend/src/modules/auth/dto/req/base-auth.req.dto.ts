import { ApiProperty, PickType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

import { TransformHelper } from '../../../../common/helpers/transform.helper';
import { BaseManagerReqDto } from '../../../manager/dto/req/base-manager.req.dto';

export class BaseAuthReqDto extends PickType(BaseManagerReqDto, [
  'password',
  'email',
  'name',
  'surname',
]) {
  @IsNotEmpty()
  @IsString()
  @Type(() => String)
  @Transform(TransformHelper.trim)
  @ApiProperty({ example: 'f6fc89eb-337d-432f-be52-a85a7d9ff94b' })
  deviceId: string;
}
