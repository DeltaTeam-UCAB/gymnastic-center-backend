import { Optional } from '@mono/types-utils'
import { InjectRepository } from '@nestjs/typeorm'
import { Comment } from 'src/notification/application/models/comment'
import { CommentRepository } from 'src/notification/application/repositories/comment.repository'
import { Comment as CommentORM } from '../../models/postgres/comment.entity'
import { Repository } from 'typeorm'

export class CommentPostgresByNotificationRepository
implements CommentRepository
{
    constructor(
        @InjectRepository(CommentORM)
        private commentProvider: Repository<CommentORM>,
    ) {}
    async getById(id: string): Promise<Optional<Comment>> {
        const comment = await this.commentProvider.findOneBy({
            id,
        })
        if (!comment) return null
        return {
            author: comment.userId,
            id: comment.id,
        }
    }
}
