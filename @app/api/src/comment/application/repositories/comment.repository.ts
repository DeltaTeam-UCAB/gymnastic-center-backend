import { Result } from 'src/core/application/result-handler/result.handler'
import { Comment, TargetType } from '../models/comment'

export interface CommentRepository {
    save(comment: Comment): Promise<Result<Comment>>
    getComments(
        targetId: string,
        targetType: TargetType,
        page: number,
        perPage: number,
    ): Promise<Comment[]>
}
