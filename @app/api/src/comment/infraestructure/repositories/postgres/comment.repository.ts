import { InjectRepository } from '@nestjs/typeorm'
import { Comment } from 'src/comment/application/models/comment'
import { CommentRepository } from 'src/comment/application/repositories/comment.repository'
import { Result } from 'src/core/application/result-handler/result.handler'
import { Comment as CommentORM } from '../../models/postgres/comment.entity'
import { Repository } from 'typeorm'

export class CommentPostgresRepository implements CommentRepository {
    constructor(
        @InjectRepository(CommentORM)
        private commentRespository: Repository<CommentORM>,
    ) {}
    async commentPost(
        id: string,
        postId: string,
        userId: string,
        description: string,
    ): Promise<Result<Comment>> {
        const comment = {
            id,
            postId,
            userId,
            description,
        }
        const save = await this.commentRespository.save(comment)
        return Result.success({
            id,
            targetId: postId,
            targetType: 'POST',
            userId,
            likes: [],
            dislikes: [],
            creationDate: save.creationDate,
            description,
        })
    }
    async commentLesson(
        id: string,
        lessonId: string,
        userId: string,
        description: string,
    ): Promise<Result<Comment>> {
        const comment = {
            id,
            lessonId,
            userId,
            description,
        }
        const save = await this.commentRespository.save(comment)
        return Result.success({
            id,
            targetId: lessonId,
            targetType: 'LESSON',
            userId,
            likes: [],
            dislikes: [],
            creationDate: save.creationDate,
            description,
        })
    }
    async getPostComments(
        postId: string,
        page: number,
        perPage: number,
    ): Promise<Comment[]> {
        const commentsORM = await this.commentRespository.find({
            where: {
                postId,
            },
            take: perPage,
            skip: page * perPage,
        })
        const comments = commentsORM.map((c) => {
            const comment: Comment = {
                id: c.id,
                description: c.description,
                targetId: postId,
                targetType: 'POST',
                userId: c.userId,
                creationDate: c.creationDate,
                likes: [],
                dislikes: [],
            }
            return comment
        })
        return comments
    }
    async getLessonComments(
        lessonId: string,
        page: number,
        perPage: number,
    ): Promise<Comment[]> {
        const commentsORM = await this.commentRespository.find({
            where: {
                lessonId,
            },
            take: perPage,
            skip: page * perPage,
        })
        const comments = commentsORM.map((c) => {
            const comment: Comment = {
                id: c.id,
                description: c.description,
                targetId: lessonId,
                targetType: 'LESSON',
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
