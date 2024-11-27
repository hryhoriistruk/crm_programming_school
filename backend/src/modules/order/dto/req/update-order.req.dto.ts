import { PartialType, PickType } from '@nestjs/swagger';

import { BaseOrderReqDto } from './base-order.req.dto';

export class UpdateOrderReqDto extends PartialType(
  PickType(BaseOrderReqDto, [
    'group_id',
    'name',
    'surname',
    'email',
    'phone',
    'age',
    'status',
    'sum',
    'alreadyPaid',
    'course',
    'course_format',
    'course_type',
  ]),
) {}
