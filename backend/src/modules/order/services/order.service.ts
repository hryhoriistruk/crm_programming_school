import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Workbook } from 'exceljs';
import { EntityManager, Repository } from 'typeorm';

import { errorMessages } from '../../../common/constants/error-messages.constant';
import { Configs, ExcelConfig } from '../../../configs/configs.type';
import { CommentEntity } from '../../../database/entities/comment.entity';
import { CourseEntity } from '../../../database/entities/course.entity';
import { CourseFormatEntity } from '../../../database/entities/course-format.entity';
import { CourseTypeEntity } from '../../../database/entities/course-type.entity';
import { EOrderStatus } from '../../../database/entities/enums/order-status.enum';
import { GroupEntity } from '../../../database/entities/group.entity';
import { ManagerEntity } from '../../../database/entities/manager.entity';
import { OrderEntity } from '../../../database/entities/order.entity';
import { OrderStatusEntity } from '../../../database/entities/order-status.entity';
import { IUserData } from '../../auth/interfaces/user-data.interface';
import { QueryReqDto } from '../../pagination/dto/req/query.req.dto';
import { PaginationResDto } from '../../pagination/dto/res/pagination.res.dto';
import { PaginationService } from '../../pagination/services/pagination.service';
import { CommentRepository } from '../../repository/services/comment.repository';
import { OrderRepository } from '../../repository/services/order.repository';
import { CommentReqDto } from '../dto/req/comment.req.dto';
import { GroupReqDto } from '../dto/req/group.req.dto';
import { UpdateOrderReqDto } from '../dto/req/update-order.req.dto';
import { CourseResDto } from '../dto/res/course.res.dto';
import { CourseFormatResDto } from '../dto/res/course-format.res.dto';
import { CourseTypeResDto } from '../dto/res/course-type.res.dto';
import { GroupResDto } from '../dto/res/group.res.dto';
import { OrderResDto } from '../dto/res/order.res.dto';
import { OrderStatusResDto } from '../dto/res/order-status.res.dto';
import { OrderStatistics } from '../interfaces/order-statistics.interface';
import { CourseMapper } from '../mappers/course.mapper';
import { CourseFormatMapper } from '../mappers/course-format.mapper';
import { CourseTypeMapper } from '../mappers/course-type.mapper';
import { GroupMapper } from '../mappers/group.mapper';
import { OrderMapper } from '../mappers/order.mapper';
import { OrderStatusMapper } from '../mappers/order-status.mapper';

@Injectable()
export class OrderService {
  private readonly excelConfig: ExcelConfig;
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly commentRepository: CommentRepository,
    private readonly paginationService: PaginationService,
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    private readonly configService: ConfigService<Configs>,
  ) {
    this.excelConfig = this.configService.get<ExcelConfig>('excel');
  }

  public async getAll(
    query: QueryReqDto,
  ): Promise<PaginationResDto<OrderResDto>> {
    const data = await this.paginationService.paginate<OrderEntity>(
      query,
      this.orderRepository,
      [{ manager: true }, { group: true }, { comments: { manager: true } }],
    );

    return OrderMapper.toOrderListDto(data);
  }

  public async saveComment(
    userData: IUserData,
    comment: CommentReqDto,
    orderId: number,
  ): Promise<OrderResDto> {
    return await this.entityManager.transaction(async (entityManager) => {
      const orderRepository = entityManager.getRepository(OrderEntity);
      const commentRepository = entityManager.getRepository(CommentEntity);
      const managerRepository = entityManager.getRepository(ManagerEntity);

      const manager = await managerRepository.findOne({
        where: { id: userData.userId },
      });

      const order = await this.saveManagerIfNotExistsAndUpdateStatus(
        orderId,
        manager,
        orderRepository,
        ['manager', 'group', 'comments', 'comments.manager'],
      );

      const savedComment = await commentRepository.save({
        text: comment.text,
        order,
        manager,
      });

      order.comments.push(savedComment);
      order.comments.sort((a, b) => b.id - a.id);

      return OrderMapper.toOrderDto(order);
    });
  }

  public async saveGroup(groupToSave: GroupReqDto): Promise<GroupResDto> {
    return await this.entityManager.transaction(async (entityManager) => {
      const groupRepository = entityManager.getRepository(GroupEntity);

      let group = await groupRepository.findOne({
        where: { name: groupToSave.name },
      });

      if (group) {
        throw new ForbiddenException(errorMessages.GROUP_ALREADY_EXISTS);
      }
      group = await groupRepository.save({ name: groupToSave.name });

      return GroupMapper.toDto(group);
    });
  }

  public async getAllGroups(): Promise<GroupResDto[]> {
    const allGroups = await this.getAllRecords(GroupEntity);

    return GroupMapper.toListDto(allGroups);
  }

  public async getAllStatuses(): Promise<OrderStatusResDto[]> {
    const allStatuses = await this.getAllRecords(OrderStatusEntity);

    return OrderStatusMapper.toListDto(allStatuses);
  }

  public async getAllCourses(): Promise<CourseResDto[]> {
    const allCourses = await this.getAllRecords(CourseEntity);

    return CourseMapper.toListDto(allCourses);
  }

  public async getAllCourseFormats(): Promise<CourseFormatResDto[]> {
    const allCourseFormats = await this.getAllRecords(CourseFormatEntity);

    return CourseFormatMapper.toListDto(allCourseFormats);
  }

  public async getAllCourseTypes(): Promise<CourseTypeResDto[]> {
    const allCourseTypes = await this.getAllRecords(CourseTypeEntity);

    return CourseTypeMapper.toListDto(allCourseTypes);
  }

  public async updateOrder(
    userData: IUserData,
    orderId: number,
    dto: UpdateOrderReqDto,
  ): Promise<OrderResDto> {
    return await this.entityManager.transaction(async (entityManager) => {
      const orderRepository = entityManager.getRepository(OrderEntity);
      const managerRepository = entityManager.getRepository(ManagerEntity);
      const groupRepository = entityManager.getRepository(GroupEntity);

      let group: GroupEntity;

      if (dto.group_id) {
        group = await groupRepository.findOneBy({
          id: dto.group_id,
        });

        if (!group) {
          throw new NotFoundException(errorMessages.GROUP_NOT_FOUND);
        }
      }
      const manager = await managerRepository.findOne({
        where: { id: userData.userId },
      });

      const order = await this.saveManagerIfNotExistsAndUpdateStatus(
        orderId,
        manager,
        orderRepository,
        ['manager', 'group'],
      );

      const updatedOrder = await orderRepository.save({
        ...order,
        ...this.handleNullValues(dto, order),
        group: dto.group_id ? group : order['group'],
      });
      return OrderMapper.toOrderDto(updatedOrder);
    });
  }

  public async createWorkbook(query: QueryReqDto): Promise<Workbook> {
    const orders = await this.getAll(query);

    return this.createAndFormatWorksheet(orders.data);
  }

  public async getOrdersStatistics(): Promise<OrderStatistics> {
    return await this.orderRepository.getStatistics();
  }
  public async getOrdersStatisticsByManagerId(
    id: number,
  ): Promise<OrderStatistics> {
    return await this.orderRepository.getStatistics(id);
  }
  private createAndFormatWorksheet(orders: OrderResDto[]): Workbook {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet(this.excelConfig.excelWorksheet);

    worksheet.columns = [
      { header: 'id', key: 'id', width: 7 },
      { header: 'name', key: 'name', width: 20 },
      { header: 'surname', key: 'surname', width: 20 },
      { header: 'email', key: 'email', width: 30 },
      { header: 'phone', key: 'phone', width: 15 },
      { header: 'age', key: 'age', width: 7 },
      { header: 'course format', key: 'course_format', width: 13 },
      { header: 'course type', key: 'course_type', width: 12 },
      { header: 'course', key: 'course', width: 12 },
      { header: 'status', key: 'status', width: 12 },
      { header: 'sum', key: 'sum', width: 15 },
      { header: 'already paid', key: 'alreadyPaid', width: 15 },
      { header: 'created', key: 'created_at', width: 20 },
      { header: 'manager', key: 'manager_name', width: 15 },
      { header: 'group', key: 'group_name', width: 15 },
    ];

    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFD966FF' },
      };
      cell.font = {
        bold: true,
        color: { argb: 'FFFFFFFF' },
      };
    });
    headerRow.commit();

    orders.forEach((order) => worksheet.addRow(order));

    return workbook;
  }
  private handleNullValues(
    dto: UpdateOrderReqDto,
    entity: OrderEntity,
  ): UpdateOrderReqDto {
    return Object.fromEntries(
      Object.entries(dto).map(([key, value]) => {
        if (key === 'sum' || key === 'alreadyPaid' || key === 'age') {
          return [key, value];
        } else {
          return [key, !value ? entity[key] : value];
        }
      }),
    );
  }
  private async saveManagerIfNotExistsAndUpdateStatus(
    orderId: number,
    manager: ManagerEntity,
    orderRepository: Repository<OrderEntity>,
    relations: string[],
  ): Promise<OrderEntity> {
    let isUpdated = false;

    const order = await orderRepository.findOne({
      where: { id: orderId },
      relations,
    });

    if (!order.manager) {
      order.manager = manager;
      isUpdated = true;
    }

    if (!order.status || order.status === EOrderStatus.NEW) {
      order.status = EOrderStatus.IN_WORK;
      isUpdated = true;
    }

    if (isUpdated) {
      await orderRepository.save(order);
    }

    return order;
  }

  private async getAllRecords<T>(entity: { new (): T }): Promise<T[]> {
    const repository = this.entityManager.getRepository(entity);

    return await repository.find();
  }
}
