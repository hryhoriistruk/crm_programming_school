import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { CourseEntity } from '../../../database/entities/course.entity';

@Injectable()
export class CourseRepository extends Repository<CourseEntity> {
  constructor(private readonly datasource: DataSource) {
    super(CourseEntity, datasource.manager);
  }
}
