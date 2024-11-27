import { ManagerEntity } from '../../../database/entities/manager.entity';
import { ManagerMapper } from '../../manager/mappers/manager.mapper';
import { ActionTokenResDto } from '../dto/res/action-token.res.dto';
import { AuthResDto } from '../dto/res/auth.res.dto';
import { TokenPairResDto } from '../dto/res/token-pair.res.dto';
import { ITokenPair } from '../interfaces/token.interface';
import { IUserData } from '../interfaces/user-data.interface';

export class AuthMapper {
  public static toDto(
    entity: ManagerEntity,
    tokenPair: ITokenPair,
  ): AuthResDto {
    return {
      tokens: this.toTokenResponseDto(tokenPair),
      manager: ManagerMapper.toDto(entity),
    };
  }
  public static toUserDataDto(
    entity: ManagerEntity,
    deviceId?: string,
  ): IUserData {
    return {
      userId: entity.id,
      deviceId,
      role: entity.user_role,
      email: entity.email,
    };
  }

  public static toTokenResponseDto(tokenPair: ITokenPair): TokenPairResDto {
    return {
      accessToken: tokenPair.accessToken,
      refreshToken: tokenPair.refreshToken,
    };
  }

  public static toActionTokenResponseDto(token: string): ActionTokenResDto {
    return {
      token,
    };
  }
}
