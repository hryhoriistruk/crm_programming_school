import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { errorMessages } from '../../../common/constants/error-messages.constant';
import { IUserData } from '../../auth/interfaces/user-data.interface';
import { OrderRepository } from '../../repository/services/order.repository';

@Injectable()
export class OrderPermissionGuard implements CanActivate {
  constructor(private readonly orderRepository: OrderRepository) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user as IUserData;

    const orderId = request.params.id;

    const order = await this.orderRepository.findOneBy({ id: orderId });

    if (!order) {
      throw new NotFoundException(errorMessages.ORDER_NOT_FOUND);
    }
    if (!order.manager_id || order.manager_id === user.userId) {
      return true;
    }
    throw new ForbiddenException(errorMessages.ORDER_ACCESS_DENIED);
  }
}
