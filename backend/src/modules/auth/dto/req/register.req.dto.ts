import { PickType } from '@nestjs/swagger';

import { BaseAuthReqDto } from './base-auth.req.dto';

export class RegisterReqDto extends PickType(BaseAuthReqDto, [
  'email',
  'name',
  'surname',
]) {}
