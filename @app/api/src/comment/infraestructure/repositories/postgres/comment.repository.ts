import { InjectRepository } from '@nestjs/typeorm'
import { Comment, TargetType } from 'src/comment/application/models/comment'
import { CommentRepository } from 'src/comment/application/repositories/comment.repository'
import { Result } from 'src/core/application/result-handler/result.handler'
import { Comment as CommentORM } from '../../models/postgres/comment.entity'
import { Repository } from 'typeorm'
import { Like } from '../../models/postgres/like.entity'
import { isNotNull } from 'src/utils/null-manager/null-checker'

export class CommentPostgresRepository implements CommentRepository {
    constructor(
        @InjectRepository(CommentORM)
        private commentRespository: Repository<CommentORM>,
        @InjectRepository(Like)
        private likeRespository: Repository<Like>,
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
        let commentsORM: CommentORM[]
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
                    blogId: targetId,
                },
                ...options,
            })
        }
        const comments = commentsORM.asyncMap(async (c) => {
            const likesORM = await this.likeRespository
                .findBy({
                    commentId: c.id,
                })
                .filter((l) => l.like === true)
            const likes: string[] = likesORM.map((l) => {
                return l.userId
            })
            const dislikesORM = await this.likeRespository
                .findBy({
                    commentId: c.id,
                })
                .filter((l) => l.like === false)
            const dislikes: string[] = dislikesORM.map((l) => {
                return l.userId
            })
            const comment: Comment = {
                id: c.id,
                description: c.description,
                targetId: targetId,
                targetType: targetType,
                userId: c.userId,
                creationDate: c.creationDate,
                likes: likes,
                dislikes: dislikes,
            }
            return comment
        })
        return comments
    }
    async existsById(id: string): Promise<boolean> {
        const exists = await this.commentRespository.existsBy({
            id,
        })
        return exists
    }
    async toggleLike(userId: string, commentId: string): Promise<boolean> {
        const userLike = await this.likeRespository.findOneBy({
            userId,
            commentId,
        })
        let like
        if (
            !isNotNull(userLike) ||
            (isNotNull(userLike) && userLike.like === false)
        ) {
            like = true
            await this.likeRespository.save({
                like: true,
                userId: userId,
                commentId: commentId,
            })
        } else {
            like = false
            await this.likeRespository.delete({
                userId,
                commentId,
            })
        }
        return like
    }
    async toggleDislike(userId: string, commentId: string): Promise<boolean> {
        const userDislike = await this.likeRespository.findOneBy({
            userId,
            commentId,
        })
        let dislike
        if (
            !isNotNull(userDislike) ||
            (isNotNull(userDislike) && userDislike.like === true)
        ) {
            dislike = true
            await this.likeRespository.save({
                like: false,
                userId: userId,
                commentId: commentId,
            })
        } else {
            dislike = false
            await this.likeRespository.delete({
                userId,
                commentId,
            })
        }
        return dislike
    }
}
