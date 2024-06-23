import { ApplicationService } from 'src/core/application/service/application.service'
import { ToggleDislikeDTO } from './types/dto'
import { ToggleDislikeResponse } from './types/response'
import { Result } from 'src/core/application/result-handler/result.handler'
import { CommentRepository } from '../../repositories/comment.repository'
import { CommentID } from 'src/comment/domain/value-objects/comment.id'
import { ClientID } from 'src/comment/domain/value-objects/client.id'
import { Comment } from 'src/comment/domain/comment'
import { EventPublisher } from 'src/core/application/event-handler/event.handler'

export class ToggleDislikeCommand
    implements ApplicationService<ToggleDislikeDTO, ToggleDislikeResponse>
{
    constructor(
        private commentRepository: CommentRepository,
        private eventPublisher: EventPublisher,
    ) {}

    async execute(
        data: ToggleDislikeDTO,
    ): Promise<Result<ToggleDislikeResponse>> {
        const comment = (await this.commentRepository.getCommentById(
            new CommentID(data.commentId),
        )) as Comment
        const clientId = new ClientID(data.userId)
        let dislike
        if (comment.clientDisliked(clientId)) {
            comment.removeDislike(clientId)
            dislike = false
        } else {
            if (comment.clientLiked(clientId)) comment.removeLike(clientId)
            comment.dislike(clientId)
            dislike = true
        }
        await this.commentRepository.save(comment)
        this.eventPublisher.publish(comment.pullEvents())
        return Result.success({ dislike })
    }
}
