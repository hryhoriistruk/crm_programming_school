import { ApiProperty } from '@nestjs/swagger';

import { EUserRole } from '../../../../database/entities/enums/user-role.enum';

export class BaseManagerResDto {
  @ApiProperty({
    example: 1,
    description: 'The id of the manager',
  })
  id: number;

  @ApiProperty({
    example: 'Ivan',
    description: 'The name of the manager',
  })
  name: string;

  @ApiProperty({
    example: 'Ivanov',
    description: 'The surname of the manager',
  })
  surname: string;

  @ApiProperty({
    example: 'user@gmail.com',
    description: 'The email of the manager',
  })
  email: string;

  @ApiProperty({
    example: false,
    description: 'Indicates whether the manager`s account is active',
  })
  is_active: boolean;

  @ApiProperty({
    example: '2024-08-12T15:29:59.200Z',
    description: 'The date when the manager last logged into the system.',
  })
  last_login: Date;

  @ApiProperty({
    example: 'admin',
    description: 'The role of the manager',
  })
  user_role: EUserRole;
}
