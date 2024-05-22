import { ApplicationService } from 'src/core/application/service/application.service'
import { CreateCommentDTO } from './types/dto'
import { CreateCommentResponse } from './types/response'
import { Result } from 'src/core/application/result-handler/result.handler'
import { CommentRepository } from '../../repositories/comment.repository'
import { IDGenerator } from 'src/core/application/ID/ID.generator'
import { PostRepository } from '../../repositories/post.repository'
import { LessonRepository } from '../../repositories/lesson.repository'
import { postNotFoundError } from '../../errors/post.not.found'
import { lessonNotFoundError } from '../../errors/lesson.not.found'

export class CreateCommentCommand
    implements ApplicationService<CreateCommentDTO, CreateCommentResponse>
{
    constructor(
        private commentRepository: CommentRepository,
        private postRepository: PostRepository,
        private lessonRepository: LessonRepository,
        private idGen: IDGenerator<string>,
    ) {}

    async execute(
        data: CreateCommentDTO,
    ): Promise<Result<CreateCommentResponse>> {
        let targetFound
        let comment
        if (data.targetType === 'POST') {
            targetFound = await this.postRepository.existsById(data.targetId)
            if (!targetFound) return Result.error(postNotFoundError())
            comment = this.commentRepository.commentPost(
                this.idGen.generate(),
                data.targetId,
                data.userId,
                data.description,
            )
        } else if (data.targetType === 'LESSON') {
            targetFound = await this.lessonRepository.existsById(data.targetId)
            if (!targetFound) return Result.error(lessonNotFoundError())
            comment = this.commentRepository.commentLesson(
                this.idGen.generate(),
                data.targetId,
                data.userId,
                data.description,
            )
        }
        return Result.success(comment)
    }
}
