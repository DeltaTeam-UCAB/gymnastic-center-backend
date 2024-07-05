import { Result } from 'src/core/application/result-handler/result.handler'
import { Target } from 'src/comment/domain/value-objects/target'
import { Comment } from 'src/comment/domain/comment'
import { CommentID } from 'src/comment/domain/value-objects/comment.id'
import { Optional } from '@mono/types-utils'

export interface CommentRepository {
    save(comment: Comment): Promise<Result<Comment>>
    getComments(
        target: Target,
        page: number,
        perPage: number,
    ): Promise<Comment[]>
    getCommentById(id: CommentID): Promise<Optional<Comment>>
    existsById(id: CommentID): Promise<boolean>
    delete(comment: Comment): Promise<Result<Comment>>
    deleteAllByTarget(target: Target): Promise<Comment[]>
}
