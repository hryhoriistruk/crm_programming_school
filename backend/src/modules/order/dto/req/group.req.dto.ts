import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length } from 'class-validator';

import { ValidatedTrimmedString } from '../../decorators/validated-trimmed-string.decorator';

export class GroupReqDto {
  @ValidatedTrimmedString()
  @IsNotEmpty()
  @Length(2, 30)
  @ApiProperty({
    example: 'sept-2024',
  })
  name: string;
}
