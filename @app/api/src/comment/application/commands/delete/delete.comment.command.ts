import { ApplicationService } from 'src/core/application/service/application.service'
import { DeleteCommentDTO } from './types/dto'
import { DeleteCommentResponse } from './types/response'
import { Result } from 'src/core/application/result-handler/result.handler'
import { CommentRepository } from '../../repositories/comment.repository'
import { EventPublisher } from 'src/core/application/event-handler/event.handler'
import { CommentID } from 'src/comment/domain/value-objects/comment.id'
import { commentNotFoundError } from '../../errors/comment.not.found'
import { ClientID } from 'src/comment/domain/value-objects/client.id'
import { clientNotAuthor } from '../../errors/client.not.author'

export class DeleteCommentCommand
    implements ApplicationService<DeleteCommentDTO, DeleteCommentResponse>
{
    constructor(
        private commentRepository: CommentRepository,
        private eventPublisher: EventPublisher,
    ) {}
    async execute(
        data: DeleteCommentDTO,
    ): Promise<Result<DeleteCommentResponse>> {
        const comment = await this.commentRepository.getCommentById(
            new CommentID(data.id),
        )
        if (!comment) return Result.error(commentNotFoundError())
        if (comment.client.id != new ClientID(data.client))
            return Result.error(clientNotAuthor())
        comment.delete()
        const result = await this.commentRepository.delete(comment)
        if (result.isError()) return result.convertToOther()
        this.eventPublisher.publish(comment.pullEvents())
        return Result.success({
            id: comment.id.id,
        })
    }
}
