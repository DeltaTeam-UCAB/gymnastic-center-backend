import { ApplicationService } from 'src/core/application/service/application.service'
import { ToggleDislikeDTO } from './types/dto'
import { ToggleDislikeResponse } from './types/response'
import { Result } from 'src/core/application/result-handler/result.handler'
import { CommentRepository } from '../../repositories/comment.repository'

export class ToggleDislikeCommand
    implements ApplicationService<ToggleDislikeDTO, ToggleDislikeResponse>
{
    constructor(private commentRepository: CommentRepository) {}

    async execute(
        data: ToggleDislikeDTO,
    ): Promise<Result<ToggleDislikeResponse>> {
        const dislike = await this.commentRepository.toggleDislike(
            data.userId,
            data.commentId,
        )
        return Result.success({ dislike })
    }
}
