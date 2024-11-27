import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';

import { errorMessages } from '../../common/constants/error-messages.constant';
import { ApiAuth } from '../../common/decorators/api-auth.decorator';
import { ApiOkExcelFile } from '../../common/decorators/api-ok-excel-file.decorator';
import { ApiPaginatedResponse } from '../../common/decorators/api-paginated-res.decorator';
import { Configs, ExcelConfig } from '../../configs/configs.type';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { IUserData } from '../auth/interfaces/user-data.interface';
import { QueryReqDto } from '../pagination/dto/req/query.req.dto';
import { PaginationResDto } from '../pagination/dto/res/pagination.res.dto';
import { CommentReqDto } from './dto/req/comment.req.dto';
import { GroupReqDto } from './dto/req/group.req.dto';
import { UpdateOrderReqDto } from './dto/req/update-order.req.dto';
import { CourseResDto } from './dto/res/course.res.dto';
import { CourseFormatResDto } from './dto/res/course-format.res.dto';
import { CourseTypeResDto } from './dto/res/course-type.res.dto';
import { GroupResDto } from './dto/res/group.res.dto';
import { OrderResDto } from './dto/res/order.res.dto';
import { OrderStatusResDto } from './dto/res/order-status.res.dto';
import { OrderPermissionGuard } from './guards/order-permission.guard';
import { OrderService } from './services/order.service';

@Controller('orders')
@ApiTags('Orders')
export class OrderController {
  private readonly excelConfig: ExcelConfig;
  constructor(
    private readonly orderService: OrderService,
    private readonly configService: ConfigService<Configs>,
  ) {
    this.excelConfig = this.configService.get<ExcelConfig>('excel');
  }

  @Get()
  @ApiAuth()
  @ApiBadRequestResponse({ description: errorMessages.BAD_REQUEST })
  @ApiPaginatedResponse(OrderResDto)
  @ApiOperation({
    description:
      'Fetches a paginated list of orders. Supports ordering by various fields.',
  })
  public async getAll(
    @Query() query: QueryReqDto,
  ): Promise<PaginationResDto<OrderResDto>> {
    return await this.orderService.getAll(query);
  }

  @Post(':id/addComment')
  @UseGuards(OrderPermissionGuard)
  @ApiAuth()
  @ApiBadRequestResponse({ description: errorMessages.BAD_REQUEST })
  @ApiNotFoundResponse({ description: errorMessages.NOT_FOUND })
  @ApiForbiddenResponse({ description: errorMessages.FORBIDDEN })
  @ApiCreatedResponse({
    description: 'Comment created successfully',
    type: OrderResDto,
  })
  @ApiOperation({ description: 'Adds comments to specific order.' })
  public async saveComment(
    @CurrentUser() userData: IUserData,
    @Body() comment: CommentReqDto,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<OrderResDto> {
    return await this.orderService.saveComment(userData, comment, id);
  }

  @Get('groups')
  @ApiAuth()
  @ApiOkResponse({
    description: 'Groups fetched successfully.',
    type: [GroupResDto],
  })
  @ApiOperation({
    description: 'Fetches a list of all groups',
  })
  public async getAllGroups(): Promise<GroupResDto[]> {
    return await this.orderService.getAllGroups();
  }

  @Post('groups')
  @ApiAuth()
  @ApiBadRequestResponse({ description: errorMessages.BAD_REQUEST })
  @ApiForbiddenResponse({ description: errorMessages.FORBIDDEN })
  @ApiCreatedResponse({
    description: 'Group created successfully',
    type: GroupResDto,
  })
  @ApiOperation({
    description: 'Adds a new group item.',
  })
  public async saveGroup(@Body() group: GroupReqDto): Promise<GroupResDto> {
    return await this.orderService.saveGroup(group);
  }

  @Get('statuses')
  @ApiAuth()
  @ApiOkResponse({
    description: 'Statuses fetched successfully.',
    type: [OrderStatusResDto],
  })
  @ApiOperation({
    description: 'Fetches a list of all statuses',
  })
  public async getAllStatuses(): Promise<OrderStatusResDto[]> {
    return await this.orderService.getAllStatuses();
  }

  @Get('courses')
  @ApiAuth()
  @ApiOkResponse({
    description: 'Courses fetched successfully.',
    type: [CourseResDto],
  })
  @ApiOperation({
    description: 'Fetches a list of all courses',
  })
  public async getAllCourses(): Promise<CourseResDto[]> {
    return await this.orderService.getAllCourses();
  }

  @Get('course-formats')
  @ApiAuth()
  @ApiOkResponse({
    description: 'Course formats fetched successfully.',
    type: [CourseFormatResDto],
  })
  @ApiOperation({
    description: 'Fetches a list of all course formats',
  })
  public async getAllCourseFormats(): Promise<CourseFormatResDto[]> {
    return await this.orderService.getAllCourseFormats();
  }

  @Get('course-types')
  @ApiAuth()
  @ApiOkResponse({
    description: 'Course types fetched successfully.',
    type: [CourseTypeResDto],
  })
  @ApiOperation({
    description: 'Fetches a list of all course types',
  })
  public async getAllCourseTypes(): Promise<CourseTypeResDto[]> {
    return await this.orderService.getAllCourseTypes();
  }

  @Patch(':id')
  @UseGuards(OrderPermissionGuard)
  @ApiAuth()
  @ApiBadRequestResponse({ description: errorMessages.BAD_REQUEST })
  @ApiNotFoundResponse({ description: errorMessages.NOT_FOUND })
  @ApiForbiddenResponse({ description: errorMessages.FORBIDDEN })
  @ApiOkResponse({
    description: 'Order updated successfully',
    type: OrderResDto,
  })
  @ApiOperation({ description: 'Updates order based on ID parameter.' })
  public async updateOrder(
    @CurrentUser() userData: IUserData,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOrderReqDto,
  ): Promise<OrderResDto> {
    return await this.orderService.updateOrder(userData, id, dto);
  }

  @Get('download')
  @ApiAuth()
  @ApiBadRequestResponse({ description: errorMessages.BAD_REQUEST })
  @ApiOkExcelFile()
  @ApiOperation({
    description: 'Fetches excel file with orders',
  })
  public async getExcelFile(
    @Query() query: QueryReqDto,
    @Res() res: Response,
  ): Promise<void> {
    const workbook = await this.orderService.createWorkbook(query);

    res.setHeader('Content-Type', `${this.excelConfig.excelMimeType}`);

    await workbook.xlsx.write(res);
    res.end();
  }
}
