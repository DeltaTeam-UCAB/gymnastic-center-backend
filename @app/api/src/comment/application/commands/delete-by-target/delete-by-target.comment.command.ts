import { ApplicationService } from 'src/core/application/service/application.service'
import { DeleteByTargetDTO } from './types/dto'
import { DeleteByTargetResponse } from './types/response'
import { Result } from 'src/core/application/result-handler/result.handler'
import { CommentRepository } from '../../repositories/comment.repository'
import { Target } from 'src/comment/domain/value-objects/target'
import { BlogID } from 'src/comment/domain/value-objects/blog.id'
import { LessonID } from 'src/comment/domain/value-objects/lesson.id'

export class DeleteByTargetCommand
    implements ApplicationService<DeleteByTargetDTO, DeleteByTargetResponse>
{
    constructor(private commentRepository: CommentRepository) {}

    async execute(
        data: DeleteByTargetDTO,
    ): Promise<Result<DeleteByTargetResponse>> {
        let target
        if (data.targetType === 'BLOG')
            target = Target.blog(new BlogID(data.targetId))
        else if (data.targetType === 'LESSON')
            target = Target.lesson(new LessonID(data.targetId))
        const result = await this.commentRepository.deleteAllByTarget(target)
        return Result.success({
            commentsDeleted: result.length,
        })
    }
}
