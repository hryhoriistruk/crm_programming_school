import {
  Body,
  Controller,
  HttpCode,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { errorMessages } from '../../common/constants/error-messages.constant';
import { statusCodes } from '../../common/constants/status-codes.constant';
import { ApiAuth } from '../../common/decorators/api-auth.decorator';
import { EUserRole } from '../../database/entities/enums/user-role.enum';
import { ManagerWithOrderStatisticsResDto } from '../manager/dto/res/manager-with-order-statistics.res.dto';
import { ActionTokenType } from './decorators/action-token-type.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { Roles } from './decorators/roles.decorator';
import { SkipAuth } from './decorators/skip-auth.decorator';
import { LoginReqDto } from './dto/req/login.req.dto';
import { ManagerPasswordReqDTO } from './dto/req/manager-password.req.dto';
import { RegisterReqDto } from './dto/req/register.req.dto';
import { ActionTokenResDto } from './dto/res/action-token.res.dto';
import { AuthResDto } from './dto/res/auth.res.dto';
import { TokenPairResDto } from './dto/res/token-pair.res.dto';
import { EActionTokenType } from './enum/action-token-type.enum';
import { ActionTokenGuard } from './guards/action-token.guard';
import { RefreshTokenGuard } from './guards/refresh-token.guard';
import { RolesGuard } from './guards/roles.guard';
import { IUserData } from './interfaces/user-data.interface';
import { AuthService } from './services/auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @SkipAuth()
  @ApiUnauthorizedResponse({ description: errorMessages.UNAUTHORIZED })
  @ApiBadRequestResponse({ description: errorMessages.BAD_REQUEST })
  @ApiCreatedResponse({
    description: 'Logged in successfully',
    type: AuthResDto,
  })
  @ApiOperation({
    description:
      'Allows a manager to log in to the system by providing valid credentials.',
  })
  public async login(@Body() dto: LoginReqDto): Promise<AuthResDto> {
    return await this.authService.login(dto);
  }

  @Post('refresh')
  @SkipAuth()
  @UseGuards(RefreshTokenGuard)
  @ApiAuth()
  @ApiCreatedResponse({
    description: 'Token refreshed successfully',
    type: TokenPairResDto,
  })
  @ApiOperation({
    description: 'Refreshes the access token using a valid refresh token.',
  })
  public async refresh(
    @CurrentUser() userData: IUserData,
  ): Promise<TokenPairResDto> {
    return await this.authService.refresh(userData);
  }

  @Post('logout')
  @HttpCode(statusCodes.NO_CONTENT)
  @ApiAuth()
  @ApiNoContentResponse({
    description: 'Logged out successfully',
  })
  @ApiOperation({
    description: 'Logs out the current user ',
  })
  public async logout(@CurrentUser() userData: IUserData): Promise<void> {
    await this.authService.logout(userData);
  }

  @Post('register')
  @Roles(EUserRole.ADMIN)
  @UseGuards(RolesGuard)
  @ApiAuth()
  @ApiBadRequestResponse({ description: errorMessages.BAD_REQUEST })
  @ApiConflictResponse({ description: errorMessages.CONFLICT })
  @ApiCreatedResponse({
    description: 'Manager created successfully',
    type: ManagerWithOrderStatisticsResDto,
  })
  @ApiOperation({
    description:
      'Registers a new manager. Only users with the Admin role can create a manager.',
  })
  public async register(
    @Body() dto: RegisterReqDto,
  ): Promise<ManagerWithOrderStatisticsResDto> {
    return await this.authService.register(dto);
  }

  @Post('activate/:managerId')
  @Roles(EUserRole.ADMIN)
  @UseGuards(RolesGuard)
  @ApiAuth()
  @ApiBadRequestResponse({ description: errorMessages.BAD_REQUEST })
  @ApiConflictResponse({ description: errorMessages.CONFLICT })
  @ApiCreatedResponse({
    description: 'Token generated successfully',
    type: ActionTokenResDto,
  })
  @ApiOperation({
    description: `Generates token for activating manager's account.  
    This token is sent to the frontend, and it's the frontend's responsibility to construct a URL. Example: http://yourdomain:port/activate/{token}.
  When a manager clicks on this link, they will be redirected to a page where they can set a new password and complete the activation process.
  `,
  })
  public async activateAccount(
    @Param('managerId', ParseIntPipe) managerId: number,
  ): Promise<ActionTokenResDto> {
    return await this.authService.generateActionToken(
      managerId,
      EActionTokenType.ACTIVATE_MANAGER,
    );
  }

  @Put('activate-manager')
  @HttpCode(statusCodes.NO_CONTENT)
  @SkipAuth()
  @ActionTokenType(EActionTokenType.ACTIVATE_MANAGER)
  @UseGuards(ActionTokenGuard)
  @ApiBadRequestResponse({ description: errorMessages.BAD_REQUEST })
  @ApiAuth()
  @ApiNoContentResponse({
    description: 'Password set successfully.',
  })
  @ApiOperation({
    description:
      'Verifies the activation token and allows the manager to set a new password.',
  })
  public async setManagerPassword(
    @CurrentUser() userData: IUserData,
    @Body() dto: ManagerPasswordReqDTO,
  ): Promise<void> {
    await this.authService.setManagerPassword(
      userData,
      dto,
      EActionTokenType.ACTIVATE_MANAGER,
    );
  }

  @Post('recovery/:managerId')
  @Roles(EUserRole.ADMIN)
  @UseGuards(RolesGuard)
  @ApiAuth()
  @ApiBadRequestResponse({ description: errorMessages.BAD_REQUEST })
  @ApiConflictResponse({ description: errorMessages.CONFLICT })
  @ApiCreatedResponse({
    description: 'Token generated successfully',
    type: ActionTokenResDto,
  })
  @ApiOperation({
    description: `Generates token for recovering the manager's password.
    This token is sent to the frontend, and it's the frontend's responsibility to construct a URL. Example: http://yourdomain:port/recovery-password/{token}.
    When a manager clicks on this link, they will be redirected to a page where they can set a new password and complete the password recovery process.
  `,
  })
  public async recoveryPassword(
    @Param('managerId', ParseIntPipe) managerId: number,
  ): Promise<ActionTokenResDto> {
    return await this.authService.generateActionToken(
      managerId,
      EActionTokenType.RECOVERY_PASSWORD,
    );
  }
  @Put('recovery-password')
  @SkipAuth()
  @ActionTokenType(EActionTokenType.RECOVERY_PASSWORD)
  @UseGuards(ActionTokenGuard)
  @ApiBadRequestResponse({ description: errorMessages.BAD_REQUEST })
  @ApiAuth()
  @ApiNoContentResponse({
    description: 'Password set successfully.',
  })
  @ApiOperation({
    description:
      'Verifies the recovery token and allows the manager to set a new password. ',
  })
  @HttpCode(statusCodes.NO_CONTENT)
  public async setRecoveryPassword(
    @CurrentUser() userData: IUserData,
    @Body() dto: ManagerPasswordReqDTO,
  ): Promise<void> {
    await this.authService.setManagerPassword(
      userData,
      dto,
      EActionTokenType.RECOVERY_PASSWORD,
    );
  }

  @Patch('ban/:managerId')
  @Roles(EUserRole.ADMIN)
  @UseGuards(RolesGuard)
  @ApiAuth()
  @ApiBadRequestResponse({ description: errorMessages.BAD_REQUEST })
  @ApiOkResponse({
    description: 'Manager was successfully banned',
    type: ManagerWithOrderStatisticsResDto,
  })
  @ApiOperation({
    description:
      'Bans a manager. Once banned, the manager will no longer be able to log in to the system.',
  })
  public async banManager(
    @Param('managerId', ParseIntPipe) managerId: number,
    @CurrentUser() userData: IUserData,
  ): Promise<ManagerWithOrderStatisticsResDto> {
    return await this.authService.banManager(managerId, userData);
  }

  @Patch('unban/:managerId')
  @Roles(EUserRole.ADMIN)
  @UseGuards(RolesGuard)
  @ApiAuth()
  @ApiOkResponse({
    description: 'Manager successfully was unbanned',
    type: ManagerWithOrderStatisticsResDto,
  })
  @ApiOperation({
    description:
      'Unbans a manager. This will allow the manager to log in to the system again.',
  })
  public async unbanManager(
    @Param('managerId', ParseIntPipe) managerId: number,
  ): Promise<ManagerWithOrderStatisticsResDto> {
    return await this.authService.unbanManager(managerId);
  }
}
