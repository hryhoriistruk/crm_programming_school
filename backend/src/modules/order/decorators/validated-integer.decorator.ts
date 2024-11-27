import { applyDecorators } from '@nestjs/common';
import { IsInt, IsNumber } from 'class-validator';

export const ValidatedInteger = (): PropertyDecorator => {
  return applyDecorators(IsNumber(), IsInt());
};
