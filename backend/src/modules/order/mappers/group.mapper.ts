import { GroupEntity } from '../../../database/entities/group.entity';
import { GroupResDto } from '../dto/res/group.res.dto';

export class GroupMapper {
  public static toListDto(data: GroupEntity[]): GroupResDto[] {
    return data.map((value) => this.toDto(value));
  }

  public static toDto(group: GroupEntity): GroupResDto {
    return {
      name: group.name,
      id: group.id,
    };
  }
}
