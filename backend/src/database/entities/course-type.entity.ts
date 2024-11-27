import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { ECourseType } from './enums/course-type.enum';
import { ETableName } from './enums/table-name.enum';

@Entity({ name: ETableName.COURSE_TYPES })
export class CourseTypeEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'enum', enum: ECourseType })
  course_type: ECourseType;
}
