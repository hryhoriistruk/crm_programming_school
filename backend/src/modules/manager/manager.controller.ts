import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ApiAuth } from '../../common/decorators/api-auth.decorator';
import { EUserRole } from '../../database/entities/enums/user-role.enum';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { IUserData } from '../auth/interfaces/user-data.interface';
import { QueryReqDto } from '../pagination/dto/req/query.req.dto';
import { BaseManagerResDto } from './dto/res/base-manager.res.dto';
import { ManagerStatisticsResDto } from './dto/res/manager-statistics.res.dto';
import { ManagerService } from './services/manager.service';

@Controller('managers')
@ApiTags('Managers')
export class ManagerController {
  constructor(private readonly managerService: ManagerService) {}

  @Get('me')
  @ApiAuth()
  @ApiOkResponse({
    description: 'Retrieved current manager info successfully',
    type: BaseManagerResDto,
  })
  @ApiOperation({
    description: 'Fetches manager info',
  })
  public async getMe(
    @CurrentUser() userData: IUserData,
  ): Promise<BaseManagerResDto> {
    return await this.managerService.getMe(userData);
  }

  @Get()
  @ApiAuth()
  @Roles(EUserRole.ADMIN)
  @UseGuards(RolesGuard)
  @ApiOkResponse({
    description: 'A list of all managers retrieved successfully',
    type: ManagerStatisticsResDto,
  })
  @ApiOperation({
    description:
      'Retrieves a list of all managers. Only accessible to users with the Admin role.',
  })
  public async getManagersAndOrdersStatistics(
    @CurrentUser() userData: IUserData,
    @Query() query: QueryReqDto,
  ): Promise<ManagerStatisticsResDto> {
    return await this.managerService.getManagersAndOrdersStatistics(
      userData,
      query,
    );
  }
}
