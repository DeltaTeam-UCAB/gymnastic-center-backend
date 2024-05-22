import { ApplicationService } from 'src/core/application/service/application.service'
import { CreateCommentDTO } from './types/dto'
import { CreateCommentResponse } from './types/response'
import { Result } from 'src/core/application/result-handler/result.handler'
import { CommentRepository } from '../../repositories/comment.repository'
import { IDGenerator } from 'src/core/application/ID/ID.generator'
import { Comment } from '../../models/comment'

export class CreateCommentCommand
    implements ApplicationService<CreateCommentDTO, CreateCommentResponse>
{
    constructor(
        private commentRepository: CommentRepository,
        private idGen: IDGenerator<string>,
    ) {}

    async execute(
        data: CreateCommentDTO,
    ): Promise<Result<CreateCommentResponse>> {
        const commentId = this.idGen.generate()
        const comment: Comment = {
            id: commentId,
            description: data.description,
            dislikes: [],
            likes: [],
            creationDate: new Date(),
            targetId: data.targetId,
            targetType: data.targetType,
            userId: data.userId,
        }
        await this.commentRepository.save(comment)
        return Result.success({ commentId })
    }
}
