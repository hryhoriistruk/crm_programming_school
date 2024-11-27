import { applyDecorators } from '@nestjs/common';
import { Transform, Type } from 'class-transformer';
import { IsString } from 'class-validator';

import { TransformHelper } from '../../../common/helpers/transform.helper';

export const ValidatedTrimmedString = (): PropertyDecorator => {
  return applyDecorators(
    IsString(),
    Type(() => String),
    Transform(TransformHelper.trim),
  );
};
