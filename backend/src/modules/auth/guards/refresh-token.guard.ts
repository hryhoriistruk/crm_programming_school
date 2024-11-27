import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { errorMessages } from '../../../common/constants/error-messages.constant';
import { ManagerRepository } from '../../repository/services/manager.repository';
import { RefreshTokenRepository } from '../../repository/services/refresh-token.repository';
import { authConstant } from '../constants/auth.constant';
import { ETokenType } from '../enum/token-type.enum';
import { AuthMapper } from '../services/auth.mapper';
import { TokenService } from '../services/token.service';

@Injectable()
export class RefreshTokenGuard implements CanActivate {
  constructor(
    private readonly tokenService: TokenService,
    private readonly refreshTokenRepository: RefreshTokenRepository,
    private readonly managerRepository: ManagerRepository,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const refreshToken = request
      .get(authConstant.AUTHORIZATION_HEADER)
      ?.split(authConstant.BEARER_PREFIX)[1];

    if (!refreshToken) {
      throw new UnauthorizedException(errorMessages.NO_TOKEN_PROVIDED);
    }
    const payload = await this.tokenService.verifyToken(
      refreshToken,
      ETokenType.REFRESH,
    );

    if (!payload) {
      throw new UnauthorizedException(errorMessages.INVALID_TOKEN);
    }
    const isTokenExists = this.refreshTokenRepository.exists({
      where: { refreshToken },
    });

    if (!isTokenExists) {
      throw new UnauthorizedException(errorMessages.INVALID_TOKEN);
    }

    const manager = await this.managerRepository.findOneBy({
      id: payload.manager_id,
    });

    if (!manager || !manager.is_active) {
      throw new UnauthorizedException(errorMessages.INVALID_TOKEN);
    }

    request.user = AuthMapper.toUserDataDto(manager, payload.deviceId);
    return true;
  }
}
