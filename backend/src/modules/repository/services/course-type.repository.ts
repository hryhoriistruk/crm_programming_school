import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { CourseTypeEntity } from '../../../database/entities/course-type.entity';

@Injectable()
export class CourseTypeRepository extends Repository<CourseTypeEntity> {
  constructor(private readonly datasource: DataSource) {
    super(CourseTypeEntity, datasource.manager);
  }
}
