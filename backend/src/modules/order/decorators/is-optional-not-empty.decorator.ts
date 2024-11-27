import { applyDecorators } from '@nestjs/common';
import { IsOptional, ValidateIf } from 'class-validator';

export const IsOptionalNotEmpty = (): PropertyDecorator => {
  return applyDecorators(
    IsOptional(),
    ValidateIf((_, value) => value !== ''),
  );
};
