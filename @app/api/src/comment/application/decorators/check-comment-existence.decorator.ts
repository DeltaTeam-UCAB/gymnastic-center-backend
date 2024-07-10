import { Result } from 'src/core/application/result-handler/result.handler'
import { ApplicationService } from 'src/core/application/service/application.service'
import { CommentRepository } from '../repositories/comment.repository'
import { commentNotFoundError } from '../errors/comment.not.found'
import { CommentID } from 'src/comment/domain/value-objects/comment.id'

export interface CommentInfo {
    commentId: string
}

export class CheckCommentExistence<T extends CommentInfo, R>
    implements ApplicationService<T, R>
{
    constructor(
        private decoratee: ApplicationService<T, R>,
        private commentRepository: CommentRepository,
    ) {}

    async execute(data: T): Promise<Result<R>> {
        const commentExists = await this.commentRepository.existsById(
            new CommentID(data.commentId),
        )
        if (!commentExists) return Result.error(commentNotFoundError())

        return this.decoratee.execute(data)
    }
}
