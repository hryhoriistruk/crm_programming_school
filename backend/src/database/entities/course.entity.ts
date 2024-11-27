import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

import { ECourse } from './enums/course.enum';
import { ETableName } from './enums/table-name.enum';

@Entity({ name: ETableName.COURSES })
export class CourseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: 'enum', enum: ECourse })
  course: ECourse;
}
