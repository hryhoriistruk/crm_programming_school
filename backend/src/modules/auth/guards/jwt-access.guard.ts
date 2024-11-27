import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { errorMessages } from '../../../common/constants/error-messages.constant';
import { ManagerRepository } from '../../repository/services/manager.repository';
import { authConstant } from '../constants/auth.constant';
import { SKIP_AUTH } from '../constants/constants';
import { ETokenType } from '../enum/token-type.enum';
import { AuthMapper } from '../services/auth.mapper';
import { AuthCacheService } from '../services/auth-cache.service';
import { TokenService } from '../services/token.service';

@Injectable()
export class JwtAccessGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly tokenService: TokenService,
    private readonly authCacheService: AuthCacheService,
    private readonly managerRepository: ManagerRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const skipAuth = this.reflector.getAllAndOverride<boolean>(SKIP_AUTH, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (skipAuth) return true;

    const request = context.switchToHttp().getRequest();

    const accessToken = request
      .get(authConstant.AUTHORIZATION_HEADER)
      ?.split(authConstant.BEARER_PREFIX)[1];

    if (!accessToken) {
      throw new UnauthorizedException(errorMessages.NO_TOKEN_PROVIDED);
    }

    const payload = await this.tokenService.verifyToken(
      accessToken,
      ETokenType.ACCESS,
    );

    if (!payload) {
      throw new UnauthorizedException(errorMessages.INVALID_TOKEN);
    }

    const isAccessTokenExists = await this.authCacheService.isAccessTokenExists(
      accessToken,
      payload.deviceId,
      payload.manager_id,
    );

    if (!isAccessTokenExists) {
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
