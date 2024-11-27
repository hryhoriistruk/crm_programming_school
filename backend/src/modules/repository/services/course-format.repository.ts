import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { CourseFormatEntity } from '../../../database/entities/course-format.entity';

@Injectable()
export class CourseFormatRepository extends Repository<CourseFormatEntity> {
  constructor(private readonly datasource: DataSource) {
    super(CourseFormatEntity, datasource.manager);
  }
}
