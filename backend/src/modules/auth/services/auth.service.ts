import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectEntityManager } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { EntityManager, Repository } from 'typeorm';

import { errorMessages } from '../../../common/constants/error-messages.constant';
import {
  AuthConfig,
  Configs,
  SecurityConfig,
} from '../../../configs/configs.type';
import { EUserRole } from '../../../database/entities/enums/user-role.enum';
import { ManagerEntity } from '../../../database/entities/manager.entity';
import { RefreshTokenEntity } from '../../../database/entities/refresh-token.entity';
import { ManagerWithOrderStatisticsResDto } from '../../manager/dto/res/manager-with-order-statistics.res.dto';
import { ManagerMapper } from '../../manager/mappers/manager.mapper';
import { OrderStatistics } from '../../order/interfaces/order-statistics.interface';
import { OrderService } from '../../order/services/order.service';
import { LoginReqDto } from '../dto/req/login.req.dto';
import { ManagerPasswordReqDTO } from '../dto/req/manager-password.req.dto';
import { RegisterReqDto } from '../dto/req/register.req.dto';
import { ActionTokenResDto } from '../dto/res/action-token.res.dto';
import { AuthResDto } from '../dto/res/auth.res.dto';
import { TokenPairResDto } from '../dto/res/token-pair.res.dto';
import { EActionTokenType } from '../enum/action-token-type.enum';
import { IActionJwtPayload } from '../interfaces/jwt-payload.interface';
import { ITokenPair } from '../interfaces/token.interface';
import { IUserData } from '../interfaces/user-data.interface';
import { AuthMapper } from './auth.mapper';
import { AuthCacheService } from './auth-cache.service';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  private securityConfig: SecurityConfig;
  private authConfig: AuthConfig;
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly configService: ConfigService<Configs>,
    private readonly tokenService: TokenService,
    private readonly authCacheService: AuthCacheService,
    private readonly orderService: OrderService,
  ) {
    this.securityConfig = this.configService.get<SecurityConfig>('security');
    this.authConfig = this.configService.get<AuthConfig>('auth');
  }

  public async login(dto: LoginReqDto): Promise<AuthResDto> {
    return await this.entityManager.transaction(async (entityManager) => {
      const managerRepository = entityManager.getRepository(ManagerEntity);
      const refreshTokenRepository =
        entityManager.getRepository(RefreshTokenEntity);

      const manager = await managerRepository.findOneBy({ email: dto.email });

      if (!manager || !manager.is_active) {
        throw new UnauthorizedException(errorMessages.WRONG_EMAIL_OR_PASSWORD);
      }

      await this.isPasswordValidOrThrow(dto.password, manager.password);

      await refreshTokenRepository.delete({
        deviceId: dto.deviceId,
        manager_id: manager.id,
      });

      const tokenPair = await this.generateAndSaveTokenPair(
        manager.id,
        manager.user_role,
        dto.deviceId,
        refreshTokenRepository,
      );

      const editedManagerEntity = await managerRepository.save({
        ...manager,
        last_login: new Date(),
      });

      return AuthMapper.toDto(editedManagerEntity, tokenPair);
    });
  }

  public async refresh(userData: IUserData): Promise<TokenPairResDto> {
    return await this.entityManager.transaction(async (entityManager) => {
      const refreshTokenRepository =
        entityManager.getRepository(RefreshTokenEntity);

      await refreshTokenRepository.delete({
        deviceId: userData.deviceId,
        manager_id: userData.userId,
      });

      const tokenPair = await this.generateAndSaveTokenPair(
        userData.userId,
        userData.role,
        userData.deviceId,
        refreshTokenRepository,
      );

      return AuthMapper.toTokenResponseDto(tokenPair);
    });
  }

  public async logout(userData: IUserData): Promise<void> {
    return await this.entityManager.transaction(async (entityManager) => {
      const refreshRepository = entityManager.getRepository(RefreshTokenEntity);

      const { userId, deviceId } = userData;

      await this.deleteRefreshAccessTokens(userId, refreshRepository, deviceId);
    });
  }

  public async register(
    dto: RegisterReqDto,
  ): Promise<ManagerWithOrderStatisticsResDto> {
    return await this.entityManager.transaction(async (entityManager) => {
      const managerRepository = entityManager.getRepository(ManagerEntity);

      const isManagerExists = await managerRepository.findOneBy({
        email: dto.email,
      });

      if (isManagerExists) {
        throw new ConflictException(errorMessages.MANAGER_ALREADY_EXISTS);
      }

      const hashedPassword = await this.hashPassword(
        this.authConfig.managerDefaultPassword,
      );
      const createdManager = await managerRepository.save(
        managerRepository.create({
          user_role: EUserRole.MANAGER,
          password: hashedPassword,
          ...dto,
        }),
      );
      return ManagerMapper.toManagerWithOrderStatisticsDto(createdManager, {
        total: 0,
        managerId: createdManager.id,
        statuses: { New: 0, Agree: 0, 'In work': 0, Dubbing: 0, Disagree: 0 },
      });
    });
  }

  public async deleteRefreshAccessTokens(
    managerId: number,
    repository: Repository<RefreshTokenEntity>,
    deviceId?: string,
  ): Promise<void> {
    if (deviceId) {
      await Promise.all([
        repository.delete({
          deviceId,
          manager_id: managerId,
        }),
        this.authCacheService.deleteAccessToken(deviceId, managerId),
      ]);
    } else {
      await Promise.all([
        repository.delete({
          manager_id: managerId,
        }),
        this.authCacheService.deleteAllAccessTokens(managerId),
      ]);
    }
  }

  public async generateActionToken(
    managerId: number,
    tokenType: EActionTokenType,
  ): Promise<ActionTokenResDto> {
    return await this.entityManager.transaction(async (entityManager) => {
      const managerRepository = entityManager.getRepository(ManagerEntity);

      const manager = await this.findManagerOrThrow(
        managerId,
        managerRepository,
      );

      if (
        tokenType === EActionTokenType.ACTIVATE_MANAGER &&
        manager.is_active
      ) {
        throw new ConflictException(errorMessages.MANAGER_ALREADY_ACTIVE);
      }

      if (
        tokenType === EActionTokenType.RECOVERY_PASSWORD &&
        !manager.is_active
      ) {
        throw new ConflictException(errorMessages.MANAGER_NOT_ACTIVE);
      }
      const actionToken = await this.generateAndSaveActionToken(
        { manager_id: managerId },
        tokenType,
      );
      return AuthMapper.toActionTokenResponseDto(actionToken);
    });
  }

  public async setManagerPassword(
    userData: IUserData,
    dto: ManagerPasswordReqDTO,
    tokenType: EActionTokenType,
  ): Promise<void> {
    return await this.entityManager.transaction(async (entityManager) => {
      const managerRepository = entityManager.getRepository(ManagerEntity);
      const refreshTokenRepository =
        entityManager.getRepository(RefreshTokenEntity);

      const { userId } = userData;

      const hashedPassword = await this.hashPassword(dto.password);
      await managerRepository.update(
        { id: userId },
        { password: hashedPassword, is_active: true },
      );
      await this.deleteActionTokens(tokenType, userId);

      if (tokenType === EActionTokenType.RECOVERY_PASSWORD) {
        await this.deleteRefreshAccessTokens(userId, refreshTokenRepository);
      }
    });
  }

  public async banManager(
    managerId: number,
    userData: IUserData,
  ): Promise<ManagerWithOrderStatisticsResDto> {
    return await this.entityManager.transaction(async (entityManager) => {
      const managerRepository = entityManager.getRepository(ManagerEntity);
      const refreshTokenRepository =
        entityManager.getRepository(RefreshTokenEntity);

      if (managerId === userData.userId) {
        throw new BadRequestException(errorMessages.BAN_NOT_POSSIBLE);
      }

      let manager = await this.findManagerOrThrow(managerId, managerRepository);
      const statistics = await this.orderService.getOrdersStatisticsByManagerId(
        manager.id,
      );

      if (manager.is_active) {
        await Promise.all([
          (manager = await managerRepository.save({
            ...manager,
            is_active: false,
          })),
          this.deleteRefreshAccessTokens(managerId, refreshTokenRepository),
          this.deleteActionTokens(
            EActionTokenType.RECOVERY_PASSWORD,
            managerId,
          ),
          this.deleteActionTokens(EActionTokenType.ACTIVATE_MANAGER, managerId),
        ]);
      }
      return ManagerMapper.toManagerWithOrderStatisticsDto(manager, statistics);
    });
  }

  public async unbanManager(
    managerId: number,
  ): Promise<ManagerWithOrderStatisticsResDto> {
    return await this.entityManager.transaction(async (entityManager) => {
      const managerRepository = entityManager.getRepository(ManagerEntity);

      let manager = await this.findManagerOrThrow(managerId, managerRepository);
      const statistics = await this.orderService.getOrdersStatisticsByManagerId(
        manager.id,
      );

      if (!manager.is_active) {
        manager = await managerRepository.save({ ...manager, is_active: true });
      }

      return ManagerMapper.toManagerWithOrderStatisticsDto(manager, statistics);
    });
  }

  private async findManagerOrThrow(
    id: number,
    repository: Repository<ManagerEntity>,
  ): Promise<ManagerEntity> {
    const manager = await repository.findOneBy({
      id,
    });

    if (!manager) {
      throw new NotFoundException(errorMessages.MANAGER_NOT_FOUND);
    }

    return manager;
  }
  private async deleteActionTokens(
    tokenType: EActionTokenType,
    managerId: number,
  ): Promise<void> {
    await this.authCacheService.deleteActionToken(tokenType, managerId);
  }
  private async generateAndSaveActionToken(
    payload: IActionJwtPayload,
    tokenType: EActionTokenType,
  ): Promise<string> {
    const actionToken = await this.tokenService.generateActionToken(
      payload,
      tokenType,
    );
    await this.authCacheService.saveActionToken(
      tokenType,
      actionToken,
      payload.manager_id,
    );
    return actionToken;
  }

  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, this.securityConfig.hashPasswordRounds);
  }

  private async generateAndSaveTokenPair(
    managerId: number,
    role: EUserRole,
    deviceId: string,
    repository: Repository<RefreshTokenEntity>,
  ): Promise<ITokenPair> {
    const tokenPair = await this.tokenService.generateTokenPair({
      role,
      manager_id: managerId,
      deviceId,
    });

    await Promise.all([
      repository.save(
        repository.create({
          refreshToken: tokenPair.refreshToken,
          deviceId,
          manager_id: managerId,
        }),
      ),
      this.authCacheService.saveAccessToken(
        tokenPair.accessToken,
        managerId,
        deviceId,
      ),
    ]);

    return tokenPair;
  }

  private async isPasswordValidOrThrow(
    password: string,
    encryptedPassword: string,
  ): Promise<void> {
    const isPasswordValid = await bcrypt.compare(password, encryptedPassword);
    if (!isPasswordValid) {
      throw new UnauthorizedException(errorMessages.WRONG_EMAIL_OR_PASSWORD);
    }
  }
}
