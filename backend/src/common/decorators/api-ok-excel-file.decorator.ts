import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { ConfigStaticService } from '../../configs/config.static';

export const ApiOkExcelFile = (): MethodDecorator => {
  return applyDecorators(
    ApiResponse({
      status: 200,
      description: 'Excel file with orders.',
      content: {
        [`${ConfigStaticService.get().excel.excelMimeType}`]: {
          schema: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    }),
  );
};
