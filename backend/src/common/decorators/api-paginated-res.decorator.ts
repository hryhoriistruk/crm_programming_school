import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from '@nestjs/swagger';

import { PaginationResDto } from '../../modules/pagination/dto/res/pagination.res.dto';

export const ApiPaginatedResponse = <T extends Type<unknown>>(
  responseType: T,
): MethodDecorator => {
  return applyDecorators(
    ApiExtraModels(PaginationResDto),
    ApiExtraModels(responseType),
    ApiOkResponse({
      description: 'Paginated list of records',
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginationResDto) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(responseType) },
              },
            },
          },
        ],
      },
    }),
  );
};
