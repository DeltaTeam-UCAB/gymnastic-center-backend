import {
    Comment,
    TargetType,
} from '../../../../../../src/comment/application/models/comment'
import { CommentRepository } from '../../../../../../src/comment/application/repositories/comment.repository'
import { Result } from '../../../../../../src/core/application/result-handler/result.handler'
import { isNotNull } from '../../../../../../src/utils/null-manager/null-checker'

export class CommentRepositoryMock implements CommentRepository {
    constructor(private comments: Comment[] = []) {}

    async existsById(id: string): Promise<boolean> {
        const comment = this.comments.filter((c) => c.id === id)[0]
        return isNotNull(comment)
    }

    async save(comment: Comment): Promise<Result<Comment>> {
        this.comments.push(comment)
        return Result.success(comment)
    }
    async getComments(
        targetId: string,
        targetType: TargetType,
        page: number,
        perPage: number,
    ): Promise<Comment[]> {
        const start = page * perPage
        const end = start + perPage
        const comments = this.comments
            .filter((c) => c.targetId === targetId)
            .slice(start, end)
        return comments
    }
    async toggleLike(userId: string, commentId: string): Promise<boolean> {
        const comment = this.comments.find((c) => c.id === commentId)
        let like
        if (!isNotNull(comment)) return false
        const likes = comment.likes
        const dislikes = comment.dislikes
        if (likes.includes(userId)) {
            like = false
            comment.likes = likes.filter((s) => s !== userId)
        } else {
            like = true
            comment.likes.push(userId)
            comment.dislikes = dislikes.filter((s) => s !== userId)
        }
        return like
    }
    async toggleDislike(userId: string, commentId: string): Promise<boolean> {
        const comment = this.comments.find((c) => c.id === commentId)
        let dislike
        if (!isNotNull(comment)) return false
        const likes = comment.likes
        const dislikes = comment.dislikes
        if (dislikes.includes(userId)) {
            dislike = false
            comment.dislikes = dislikes.filter((s) => s !== userId)
        } else {
            dislike = true
            comment.dislikes.push(userId)
            comment.likes = likes.filter((s) => s !== userId)
        }
        return dislike
    }
}
