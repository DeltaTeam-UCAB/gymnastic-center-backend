import { Result } from 'src/core/application/result-handler/result.handler'
import { Comment } from '../models/comment'

export interface CommentRepository {
    commentPost(
        id: string,
        postId: string,
        userId: string,
        description: string,
    ): Promise<Result<Comment>>
    commentLesson(
        id: string,
        lessonId: string,
        userId: string,
        description: string,
    ): Promise<Result<Comment>>
    getPostComments(
        postId: string,
        page: number,
        perPage: number,
    ): Promise<Comment[]>
    getLessonComments(
        lessonId: string,
        page: number,
        perPage: number,
    ): Promise<Comment[]>
}
