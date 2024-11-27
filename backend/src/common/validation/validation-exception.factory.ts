import { BadRequestException, ValidationError } from '@nestjs/common';

export function createValidationExceptionFactory() {
  return (errors: ValidationError[]) => {
    const errorMessages = errors
      .map((err) => Object.values(err.constraints))
      .join('; ');

    return new BadRequestException(errorMessages);
  };
}
