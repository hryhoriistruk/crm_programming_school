import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { JWTConfig } from '../../../configs/configs.type';
import { RedisService } from '../../redis/services/redis.service';
import { EActionTokenType } from '../enum/action-token-type.enum';
import { ETokenType } from '../enum/token-type.enum';

@Injectable()
export class AuthCacheService {
  private jwtConfig: JWTConfig;

  constructor(
    private readonly redisService: RedisService,
    private readonly configService: ConfigService,
  ) {
    this.jwtConfig = this.configService.get<JWTConfig>('jwt');
  }

  public async saveAccessToken(
    token: string,
    managerId: number,
    deviceId: string,
  ): Promise<void> {
    const key = this.getAccessTokenKey(managerId, deviceId);
    const expire = this.jwtConfig.access_expires_in;

    await this.save(key, token, expire);
  }

  public async saveActionToken(
    tokenType: EActionTokenType,
    token: string,
    managerId: number,
  ): Promise<void> {
    const key = this.getActionTokenKey(managerId, tokenType);
    const expire = this.jwtConfig.action_expires_in;
    await this.save(key, token, expire, false);
  }

  public async isAccessTokenExists(
    token: string,
    deviceId: string,
    managerId: number,
  ): Promise<boolean> {
    const key = this.getAccessTokenKey(managerId, deviceId);
    return await this.isExists(key, token);
  }

  public async isActionTokenExists(
    token: string,
    tokenType: EActionTokenType,
    managerId: number,
  ): Promise<boolean> {
    const key = this.getActionTokenKey(managerId, tokenType);
    return await this.isExists(key, token);
  }

  public async deleteAccessToken(
    deviceId: string,
    managerId: number,
  ): Promise<void> {
    const key = this.getAccessTokenKey(managerId, deviceId);
    await this.delete(key);
  }

  public async deleteActionToken(
    tokenType: EActionTokenType,
    managerId: number,
  ): Promise<void> {
    const key = this.getActionTokenKey(managerId, tokenType);
    await this.delete(key);
  }

  public async deleteAllAccessTokens(managerId: number): Promise<void> {
    const pattern = `${ETokenType.ACCESS}:${managerId}:*`;

    const keys = await this.redisService.keys(pattern);
    const commands: [string, ...any[]][] = [];
    if (keys) {
      keys.forEach((key) => commands.push(['del', key]));
      await this.redisService.execMulti(commands);
    }
  }
  private getAccessTokenKey(managerId: number, deviceId: string): string {
    return `${ETokenType.ACCESS}:${managerId}:${deviceId}`;
  }
  private getActionTokenKey(
    managerId: number,
    tokenType: EActionTokenType,
  ): string {
    return `${ETokenType.ACTION}:${tokenType}:${managerId}`;
  }

  private async save(
    key: string,
    token: string,
    expire: number,
    deletePreviousKey: boolean = true,
  ): Promise<void> {
    let commands: [string, ...any[]][];

    if (deletePreviousKey) {
      commands = [
        ['del', key],
        ['sadd', key, token],
        ['expire', key, expire],
      ];
    } else {
      commands = [
        ['sadd', key, token],
        ['expire', key, expire],
      ];
    }

    await this.redisService.execMulti(commands);
  }

  private async delete(key: string): Promise<void> {
    const commands: [string, ...any[]][] = [['del', key]];

    await this.redisService.execMulti(commands);
  }

  private async isExists(key: string, token: string): Promise<boolean> {
    const setOfValues = await this.redisService.sMembers(key);

    return setOfValues.includes(token);
  }
}
