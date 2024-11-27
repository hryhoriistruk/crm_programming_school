import { CourseEntity } from '../../../database/entities/course.entity';
import { CourseResDto } from '../dto/res/course.res.dto';

export class CourseMapper {
  public static toListDto(data: CourseEntity[]): CourseResDto[] {
    return data.map((value) => this.toDto(value));
  }

  public static toDto(value: CourseEntity): CourseResDto {
    return {
      courseName: value.course,
      id: value.id,
    };
  }
}
