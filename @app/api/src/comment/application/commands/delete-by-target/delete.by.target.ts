import { ApplicationService } from 'src/core/application/service/application.service'
import { DeleteCommentsByTargetDTO } from './types/dto'
import { Result } from 'src/core/application/result-handler/result.handler'
import { CommentRepository } from '../../repositories/comment.repository'
import { EventPublisher } from 'src/core/application/event-handler/event.handler'
import { Target } from 'src/comment/domain/value-objects/target'
import { LessonID } from 'src/comment/domain/value-objects/lesson.id'
import { BlogID } from 'src/comment/domain/value-objects/blog.id'

export class DeleteCommentsByTargetCommand
implements ApplicationService<DeleteCommentsByTargetDTO, void>
{
    constructor(
        private commentRepository: CommentRepository,
        private eventPublisher: EventPublisher,
    ) {}
    async execute(data: DeleteCommentsByTargetDTO): Promise<Result<void>> {
        const comments = await this.commentRepository.getAllCommentsByTarget(
            data.type === 'LESSON'
                ? Target.lesson(new LessonID(data.targetId))
                : Target.blog(new BlogID(data.targetId)),
        )
        const results = await comments.asyncMap((comment) => {
            comment.delete()
            return this.commentRepository.delete(comment)
        })
        const possibleError = results.find((e) => e.isError())
        if (possibleError) return possibleError.convertToOther()
        const commentsDeleted = results.map((e) => e.unwrap())
        this.eventPublisher.publish(
            commentsDeleted.map((e) => e.pullEvents()).flat(),
        )
        return Result.success(undefined)
    }
}
