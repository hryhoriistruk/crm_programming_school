import { SetMetadata } from '@nestjs/common';

import { ACTION_TOKEN_TYPE } from '../constants/constants';
import { EActionTokenType } from '../enum/action-token-type.enum';

export const ActionTokenType = (tokenType: EActionTokenType) =>
  SetMetadata(ACTION_TOKEN_TYPE, tokenType);
