import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';

import { errorMessages } from '../constants/error-messages.constant';

export const ApiAuth = (): MethodDecorator => {
  return applyDecorators(
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: errorMessages.UNAUTHORIZED }),
  );
};
