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
import { ACTION_TOKEN_TYPE } from '../constants/constants';
import { EActionTokenType } from '../enum/action-token-type.enum';
import { AuthMapper } from '../services/auth.mapper';
import { AuthCacheService } from '../services/auth-cache.service';
import { TokenService } from '../services/token.service';

@Injectable()
export class ActionTokenGuard implements CanActivate {
  constructor(
    private readonly managerRepository: ManagerRepository,
    private readonly reflector: Reflector,
    private readonly tokenService: TokenService,
    private readonly authCacheService: AuthCacheService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const actionToken = req
      .get(authConstant.AUTHORIZATION_HEADER)
      ?.split(authConstant.BEARER_PREFIX)[1];

    if (!actionToken) {
      throw new UnauthorizedException(errorMessages.NO_TOKEN_PROVIDED);
    }

    const tokenType = this.reflector.get<EActionTokenType>(
      ACTION_TOKEN_TYPE,
      context.getHandler(),
    );

    if (!tokenType) {
      throw new UnauthorizedException(errorMessages.NO_TOKEN_TYPE_PROVIDED);
    }

    const payload = await this.tokenService.verifyActionToken(
      actionToken,
      tokenType,
    );

    if (!payload) {
      throw new UnauthorizedException(errorMessages.INVALID_TOKEN);
    }

    const isTokenExists = await this.authCacheService.isActionTokenExists(
      actionToken,
      tokenType,
      payload.manager_id,
    );

    if (!isTokenExists) {
      throw new UnauthorizedException(errorMessages.INVALID_TOKEN);
    }

    const manager = await this.managerRepository.findOneBy({
      id: payload.manager_id,
    });

    if (!manager) {
      throw new UnauthorizedException(errorMessages.INVALID_TOKEN);
    }

    req.user = AuthMapper.toUserDataDto(manager);
    return true;
  }
}
