import { ApplicationService } from 'src/core/application/service/application.service'
import { FindCommentsDTO } from './types/dto'
import { Result } from 'src/core/application/result-handler/result.handler'
import { CommentRepository } from '../../repositories/comment.repository'
import { FindCommentsResponse } from './types/response'
import { Target } from 'src/comment/domain/value-objects/target'
import { BlogID } from 'src/comment/domain/value-objects/blog.id'
import { LessonID } from 'src/comment/domain/value-objects/lesson.id'
import { ClientID } from 'src/comment/domain/value-objects/client.id'

export class FindCommentsQuery
    implements ApplicationService<FindCommentsDTO, FindCommentsResponse[]>
{
    constructor(private commentRepository: CommentRepository) {}

    async execute(
        data: FindCommentsDTO,
    ): Promise<Result<FindCommentsResponse[]>> {
        const comments = await this.commentRepository.getComments(
            data.targetType === 'BLOG'
                ? Target.blog(new BlogID(data.targetId))
                : Target.lesson(new LessonID(data.targetId)),
            data.page,
            data.perPage,
        )
        const commentsResponse = await comments.asyncMap(async (c) => {
            const commentResponse = {
                id: c.id.id,
                user: c.client.name.name,
                userId: c.client.id.id,
                countLikes: c.whoLiked.length,
                countDislikes: c.whoDisliked.length,
                body: c.content.content,
                userLiked: c.clientLiked(new ClientID(data.userId)),
                userDisliked: c.clientDisliked(new ClientID(data.userId)),
                date: c.date.date,
            }
            return commentResponse
        })
        return Result.success(commentsResponse)
    }
}
