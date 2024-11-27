import { BaseManagerResDto } from '../../../manager/dto/res/base-manager.res.dto';
import { TokenPairResDto } from './token-pair.res.dto';

export class AuthResDto {
  tokens: TokenPairResDto;
  manager: BaseManagerResDto;
}
