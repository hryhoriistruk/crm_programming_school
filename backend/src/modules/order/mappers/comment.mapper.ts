import { CommentEntity } from '../../../database/entities/comment.entity';
import { CommentResDto } from '../dto/res/comment.res.dto';

export class CommentMapper {
  public static toListDto(comments: CommentEntity[]): CommentResDto[] {
    return comments.map((value) => this.toDto(value));
  }

  public static toDto(comment: CommentEntity): CommentResDto {
    return {
      id: comment.id,
      text: comment.text,
      created_at: comment.created_at,
      manager_name: comment.manager.name || 'No_name',
    };
  }
}
