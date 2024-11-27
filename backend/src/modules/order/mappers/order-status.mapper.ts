import { OrderStatusEntity } from '../../../database/entities/order-status.entity';
import { OrderStatusResDto } from '../dto/res/order-status.res.dto';

export class OrderStatusMapper {
  public static toListDto(data: OrderStatusEntity[]): OrderStatusResDto[] {
    return data.map((value) => this.toDto(value));
  }

  public static toDto(value: OrderStatusEntity): OrderStatusResDto {
    return {
      status: value.status,
      id: value.id,
    };
  }
}
