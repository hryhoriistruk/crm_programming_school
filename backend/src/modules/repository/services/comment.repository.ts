import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';

import { CommentEntity } from '../../../database/entities/comment.entity';

@Injectable()
export class CommentRepository extends Repository<CommentEntity> {
  constructor(private readonly datasource: DataSource) {
    super(CommentEntity, datasource.manager);
  }
}
