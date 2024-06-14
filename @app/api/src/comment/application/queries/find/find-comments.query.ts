import { ApplicationService } from 'src/core/application/service/application.service'
import { FindCommentsDTO } from './types/dto'
import { Result } from 'src/core/application/result-handler/result.handler'
import { CommentRepository } from '../../repositories/comment.repository'
import { FindCommentsResponse } from './types/response'
import { UserRepository } from '../../repositories/user.repository'

export class FindCommentsQuery
    implements ApplicationService<FindCommentsDTO, FindCommentsResponse[]>
{
    constructor(
        private commentRepository: CommentRepository,
        private userRepository: UserRepository,
    ) {}

    async execute(
        data: FindCommentsDTO,
    ): Promise<Result<FindCommentsResponse[]>> {
        const comments = await this.commentRepository.getComments(
            data.targetId,
            data.targetType,
            data.page,
            data.perPage,
        )
        const commentsResponse = await comments.asyncMap(async (c) => {
            const commentResponse = {
                id: c.id,
                user: (await this.userRepository.getById(data.userId))!.name,
                countLikes: c.likes.length,
                countDislikes: c.dislikes.length,
                body: c.description,
                userLiked: c.likes.includes(data.userId),
                userDisliked: c.dislikes.includes(data.userId),
                date: c.creationDate,
            }
            return commentResponse
        })
        return Result.success(commentsResponse)
    }
}
