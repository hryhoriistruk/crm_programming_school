import { PickType } from '@nestjs/swagger';

import { BaseAuthReqDto } from './base-auth.req.dto';

export class ManagerPasswordReqDTO extends PickType(BaseAuthReqDto, [
  'password',
]) {}
