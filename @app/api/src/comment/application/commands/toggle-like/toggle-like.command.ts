import { ApplicationService } from 'src/core/application/service/application.service'
import { ToggleLikeDTO } from './types/dto'
import { ToggleLikeResponse } from './types/response'
import { Result } from 'src/core/application/result-handler/result.handler'
import { CommentRepository } from '../../repositories/comment.repository'
import { CommentID } from 'src/comment/domain/value-objects/comment.id'
import { Comment } from 'src/comment/domain/comment'
import { ClientID } from 'src/comment/domain/value-objects/client.id'
import { EventPublisher } from 'src/core/application/event-handler/event.handler'

export class ToggleLikeCommand
    implements ApplicationService<ToggleLikeDTO, ToggleLikeResponse>
{
    constructor(
        private commentRepository: CommentRepository,
        private eventPublisher: EventPublisher,
    ) {}

    async execute(data: ToggleLikeDTO): Promise<Result<ToggleLikeResponse>> {
        const comment = (await this.commentRepository.getCommentById(
            new CommentID(data.commentId),
        )) as Comment
        const clientId = new ClientID(data.userId)
        let like
        if (comment.clientLiked(clientId)) {
            comment.removeLike(clientId)
            like = false
        } else {
            if (comment.clientDisliked(clientId))
                comment.removeDislike(clientId)

            comment.like(clientId)
            like = true
        }
        this.commentRepository.save(comment)
        this.eventPublisher.publish(comment.pullEvents())
        return Result.success({ like })
    }
}
