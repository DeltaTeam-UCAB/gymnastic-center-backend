import { Optional } from '@mono/types-utils'
import { Comment } from '../models/comment'

export interface CommentRepository {
    getById(id: string): Promise<Optional<Comment>>
}
