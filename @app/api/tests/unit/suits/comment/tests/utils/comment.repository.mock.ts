import { Comment } from '../../../../../../src/comment/domain/comment'
import { CommentRepository } from '../../../../../../src/comment/application/repositories/comment.repository'
import { Target } from '../../../../../../src/comment/domain/value-objects/target'
import { Result } from '../../../../../../src/core/application/result-handler/result.handler'
import { Optional } from '@mono/types-utils'
import { CommentID } from '../../../../../../src/comment/domain/value-objects/comment.id'

export class CommentRepositoryMock implements CommentRepository {
    constructor(private comments: Comment[] = []) {}

    async getCommentById(id: CommentID): Promise<Optional<Comment>> {
        const comment = this.comments.filter((c) => c.id == id)[0]
        return comment
    }

    async existsById(id: CommentID): Promise<boolean> {
        const exists = this.comments.some((c) => c.id == id)
        return exists
    }

    async save(comment: Comment): Promise<Result<Comment>> {
        this.comments = this.comments.filter((c) => c.id != comment.id)
        this.comments.push(comment)
        return Result.success(comment)
    }
    async getComments(
        target: Target,
        page: number,
        perPage: number,
    ): Promise<Comment[]> {
        const start = (page - 1) * perPage
        const end = start + perPage
        const comments = this.comments
            .filter((c) => c.target == target)
            .slice(start, end)
        return comments
    }

    async delete(comment: Comment): Promise<Result<Comment>> {
        this.comments = this.comments.filter((e) => e.id != comment.id)
        return Result.success(comment)
    }
}
