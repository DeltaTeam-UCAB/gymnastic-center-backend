import { InjectRepository } from '@nestjs/typeorm'
import { Comment, TargetType } from 'src/comment/application/models/comment'
import { CommentRepository } from 'src/comment/application/repositories/comment.repository'
import { Result } from 'src/core/application/result-handler/result.handler'
import { Comment as CommentORM } from '../../models/postgres/comment.entity'
import { Repository } from 'typeorm'

export class CommentPostgresRepository implements CommentRepository {
    constructor(
        @InjectRepository(CommentORM)
        private commentRespository: Repository<CommentORM>,
    ) {}
    async save(comment: Comment): Promise<Result<Comment>> {
        await this.commentRespository.save(comment)
        return Result.success(comment)
    }
    async getComments(
        targetId: string,
        targetType: TargetType,
        page: number,
        perPage: number,
    ): Promise<Comment[]> {
        const options = {
            take: perPage,
            skip: page * perPage,
        }
        let commentsORM
        if (targetType === 'LESSON') {
            commentsORM = await this.commentRespository.find({
                where: {
                    lessonId: targetId,
                },
                ...options,
            })
        } else {
            commentsORM = await this.commentRespository.find({
                where: {
                    postId: targetId,
                },
                ...options,
            })
        }
        const comments = commentsORM.map((c) => {
            const comment: Comment = {
                id: c.id,
                description: c.description,
                targetId: targetId,
                targetType: targetType,
                userId: c.userId,
                creationDate: c.creationDate,
                likes: [],
                dislikes: [],
            }
            return comment
        })
        return comments
    }
}
