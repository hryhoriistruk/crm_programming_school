import { CourseFormatEntity } from '../../../database/entities/course-format.entity';
import { CourseFormatResDto } from '../dto/res/course-format.res.dto';

export class CourseFormatMapper {
  public static toListDto(data: CourseFormatEntity[]): CourseFormatResDto[] {
    return data.map((value) => this.toDto(value));
  }

  public static toDto(value: CourseFormatEntity): CourseFormatResDto {
    return {
      format: value.course_format,
      id: value.id,
    };
  }
}
