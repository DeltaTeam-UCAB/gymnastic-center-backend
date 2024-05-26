import { ApplicationService } from 'src/core/application/service/application.service'
import { ToggleLikeDTO } from './types/dto'
import { ToggleLikeResponse } from './types/response'
import { Result } from 'src/core/application/result-handler/result.handler'
import { CommentRepository } from '../../repositories/comment.repository'

export class ToggleLikeCommand
    implements ApplicationService<ToggleLikeDTO, ToggleLikeResponse>
{
    constructor(private commentRepository: CommentRepository) {}

    async execute(data: ToggleLikeDTO): Promise<Result<ToggleLikeResponse>> {
        const like = await this.commentRepository.toggleLike(
            data.userId,
            data.commentId,
        )
        return Result.success({ like })
    }
}
