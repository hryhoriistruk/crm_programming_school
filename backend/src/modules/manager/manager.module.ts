import { Module } from '@nestjs/common';

import { OrderModule } from '../order/order.module';
import { PaginationModule } from '../pagination/pagination.module';
import { ManagerController } from './manager.controller';
import { ManagerService } from './services/manager.service';

@Module({
  imports: [OrderModule, PaginationModule],
  providers: [ManagerService],
  controllers: [ManagerController],
})
export class ManagerModule {}
