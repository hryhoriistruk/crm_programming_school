import { applyDecorators } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export const ApiPaginatedManagerStatistics = (): PropertyDecorator => {
  return applyDecorators(
    ApiProperty({
      description: 'List of managers',
      example: {
        data: [
          {
            id: 3,
            email: 'elena@gmail.com',
            name: 'Elena',
            surname: 'Ivanova',
            is_active: false,
            last_login: '2024-10-05T06:20:42.000Z',
            user_role: 'MANAGER',
            orders_statistics: {
              total: 10,
              new: 1,
              inWork: 8,
              agree: 0,
              disagree: 1,
              dubbing: 0,
            },
          },
        ],
        page: 1,
        limit: 25,
        totalCount: 20,
      },
    }),
  );
};
