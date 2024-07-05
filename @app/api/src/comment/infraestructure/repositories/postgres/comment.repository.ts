import { InjectRepository } from '@nestjs/typeorm'
import { CommentRepository } from 'src/comment/application/repositories/comment.repository'
import { Result } from 'src/core/application/result-handler/result.handler'
import { Comment as CommentORM } from '../../models/postgres/comment.entity'
import { Repository } from 'typeorm'
import { Like } from '../../models/postgres/like.entity'
import { isNotNull } from 'src/utils/null-manager/null-checker'
import { Comment } from 'src/comment/domain/comment'
import { Target } from 'src/comment/domain/value-objects/target'
import { CommentID } from 'src/comment/domain/value-objects/comment.id'
import { Client } from 'src/comment/domain/entities/client'
import { ClientID } from 'src/comment/domain/value-objects/client.id'
import { User } from '../../models/postgres/user.entity'
import { ClientName } from 'src/comment/domain/value-objects/client.name'
import { CommentContent } from 'src/comment/domain/value-objects/comment.content'
import { CommentDate } from 'src/comment/domain/value-objects/comment.date'
import { Optional } from '@mono/types-utils'
import { BlogID } from 'src/comment/domain/value-objects/blog.id'
import { LessonID } from 'src/comment/domain/value-objects/lesson.id'

export class CommentPostgresRepository implements CommentRepository {
    constructor(
        @InjectRepository(CommentORM)
        private commentRespository: Repository<CommentORM>,
        @InjectRepository(Like)
        private likeRespository: Repository<Like>,
        @InjectRepository(User)
        private userRespository: Repository<User>,
    ) {}
    async getCommentById(id: CommentID): Promise<Optional<Comment>> {
        const exists = await this.commentRespository.exists({
            where: {
                id: id.id,
            },
        })
        if (!exists) return null
        const comment = (await this.commentRespository.findOneBy({
            id: id.id,
        })) as CommentORM
        const likes = await this.likeRespository.findBy({
            commentId: id.id,
            like: true,
        })
        const dislikes = await this.likeRespository.findBy({
            commentId: id.id,
            like: false,
        })
        const client = (await this.userRespository.findOneBy({
            id: comment.userId,
        })) as User
        return new Comment(id, {
            client: new Client(new ClientID(client.id), {
                name: new ClientName(client.name),
            }),
            content: new CommentContent(comment.description),
            target: isNotNull(comment.blogId)
                ? Target.blog(new BlogID(comment.blogId))
                : Target.lesson(new LessonID(comment.lessonId)),
            creationDate: new CommentDate(comment.creationDate),
            whoLiked: likes.map((l) => new ClientID(l.userId)),
            whoDisliked: dislikes.map((d) => new ClientID(d.userId)),
        })
    }
    async save(comment: Comment): Promise<Result<Comment>> {
        const commentORM = {
            id: comment.id.id,
            userId: comment.client.id.id,
            description: comment.content.content,
            lessonId: comment.target.lessonTarget()
                ? comment.target.lesson.id
                : undefined,
            blogId: comment.target.blogTarget()
                ? comment.target.blog.id
                : undefined,
        }
        await this.commentRespository.save(commentORM)
        await this.likeRespository.delete({
            commentId: comment.id.id,
        })
        await comment.whoLiked.asyncForEach(async (l) =>
            this.likeRespository.save({
                commentId: comment.id.id,
                userId: l.id,
                like: true,
            }),
        )
        await comment.whoDisliked.asyncForEach(async (d) =>
            this.likeRespository.save({
                commentId: comment.id.id,
                userId: d.id,
                like: false,
            }),
        )
        return Result.success(comment)
    }
    async getComments(
        target: Target,
        page: number,
        perPage: number,
    ): Promise<Comment[]> {
        const options = {
            take: perPage,
            skip: (page - 1) * perPage,
        }
        let commentsORM: CommentORM[]
        if (target.lessonTarget()) {
            commentsORM = await this.commentRespository.find({
                where: {
                    lessonId: target.lesson.id,
                },
                ...options,
                order: {
                    creationDate: 'DESC',
                },
            })
        } else {
            commentsORM = await this.commentRespository.find({
                where: {
                    blogId: target.blog.id,
                },
                ...options,
                order: {
                    creationDate: 'DESC',
                },
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
            const user = (await this.userRespository.findOneBy({
                id: c.userId,
            })) as User
            const comment = new Comment(new CommentID(c.id), {
                client: new Client(new ClientID(c.userId), {
                    name: new ClientName(user.name),
                }),
                content: new CommentContent(c.description),
                target,
                whoLiked: likes.map((l) => new ClientID(l)),
                whoDisliked: dislikes.map((l) => new ClientID(l)),
                creationDate: new CommentDate(c.creationDate),
            })
            return comment
        })
        return comments
    }
    async existsById(id: CommentID): Promise<boolean> {
        const exists = await this.commentRespository.existsBy({
            id: id.id,
        })
        return exists
    }

    async delete(comment: Comment): Promise<Result<Comment>> {
        await this.likeRespository.delete({
            commentId: comment.id.id,
        })
        await this.commentRespository.delete({
            id: comment.id.id,
        })
        return Result.success(comment)
    }

    async deleteAllByTarget(target: Target): Promise<Comment[]> {
        let commentsORM: CommentORM[]
        if (target.lessonTarget()) {
            commentsORM = await this.commentRespository.find({
                where: {
                    lessonId: target.lesson.id,
                },
            })
        } else {
            commentsORM = await this.commentRespository.find({
                where: {
                    blogId: target.blog.id,
                },
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
            const user = (await this.userRespository.findOneBy({
                id: c.userId,
            })) as User
            const comment = new Comment(new CommentID(c.id), {
                client: new Client(new ClientID(c.userId), {
                    name: new ClientName(user.name),
                }),
                content: new CommentContent(c.description),
                target,
                whoLiked: likes.map((l) => new ClientID(l)),
                whoDisliked: dislikes.map((l) => new ClientID(l)),
                creationDate: new CommentDate(c.creationDate),
            })
            return comment
        })
        await this.commentRespository.remove(commentsORM)
        return comments
    }
}
