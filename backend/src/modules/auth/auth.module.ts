import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';

import { OrderModule } from '../order/order.module';
import { RedisModule } from '../redis/redis.module';
import { AuthController } from './auth.controller';
import { JwtAccessGuard } from './guards/jwt-access.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { AuthService } from './services/auth.service';
import { AuthCacheService } from './services/auth-cache.service';
import { TokenService } from './services/token.service';

@Module({
  imports: [RedisModule, JwtModule, OrderModule],
  providers: [
    AuthService,
    AuthCacheService,
    TokenService,
    { provide: APP_GUARD, useClass: JwtAccessGuard },
    RefreshTokenGuard,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
