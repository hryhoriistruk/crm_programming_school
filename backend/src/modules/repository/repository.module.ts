import { Global, Module } from '@nestjs/common';

import { CommentRepository } from './services/comment.repository';
import { CourseRepository } from './services/course.repository';
import { CourseFormatRepository } from './services/course-format.repository';
import { CourseTypeRepository } from './services/course-type.repository';
import { GroupRepository } from './services/group.repository';
import { ManagerRepository } from './services/manager.repository';
import { OrderRepository } from './services/order.repository';
import { OrderStatusRepository } from './services/order-status.repository';
import { RefreshTokenRepository } from './services/refresh-token.repository';

const repositories = [
  ManagerRepository,
  OrderRepository,
  GroupRepository,
  RefreshTokenRepository,
  CommentRepository,
  OrderStatusRepository,
  CourseTypeRepository,
  CourseFormatRepository,
  CourseRepository,
];
@Global()
@Module({
  exports: [...repositories],
  providers: [...repositories],
})
export class RepositoryModule {}
