import { CourseTypeEntity } from '../../../database/entities/course-type.entity';
import { CourseTypeResDto } from '../dto/res/course-type.res.dto';

export class CourseTypeMapper {
  public static toListDto(data: CourseTypeEntity[]): CourseTypeResDto[] {
    return data.map((value) => this.toDto(value));
  }

  public static toDto(value: CourseTypeEntity): CourseTypeResDto {
    return {
      type: value.course_type,
      id: value.id,
    };
  }
}
