import { ApplicationService } from 'src/core/application/service/application.service'
import { FindCommentsDTO } from './types/dto'
import { Result } from 'src/core/application/result-handler/result.handler'
import { CommentRepository } from '../../repositories/comment.repository'
import { PostRepository } from '../../repositories/post.repository'
import { LessonRepository } from '../../repositories/lesson.repository'
import { postNotFoundError } from '../../errors/post.not.found'
import { lessonNotFoundError } from '../../errors/lesson.not.found'
import { FindCommentsResponse } from './types/response'
import { Comment } from '../../models/comment'

export class FindCommentsQuery
    implements ApplicationService<FindCommentsDTO, FindCommentsResponse[]>
{
    constructor(
        private commentRepository: CommentRepository,
        private postRepository: PostRepository,
        private lessonRepository: LessonRepository,
    ) {}

    async execute(
        data: FindCommentsDTO,
    ): Promise<Result<FindCommentsResponse[]>> {
        let comments: Comment[] = []
        let targetFound
        if (data.targetType === 'POST') {
            targetFound = await this.postRepository.existsById(data.targetId)
            if (!targetFound) return Result.error(postNotFoundError())
            comments = await this.commentRepository.getPostComments(
                data.targetId,
                data.page,
                data.perPage,
            )
        } else if (data.targetType === 'LESSON') {
            targetFound = await this.lessonRepository.existsById(data.targetId)
            if (!targetFound) return Result.error(lessonNotFoundError())
            comments = await this.commentRepository.getLessonComments(
                data.targetId,
                data.page,
                data.perPage,
            )
        }
        const commentsResponse = comments.map((c) => {
            const commentResponse = {
                id: c.id,
                user: c.userId,
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
