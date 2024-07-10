import { RabbitMQEventHandler } from 'src/core/infraestructure/event-handler/rabbitmq/rabbit.service'
import { CommentPostgresRepository } from '../../repositories/postgres/comment.repository'
import { BLOG_DELETED, blogDeleted } from './event/blog.deleted'
import { BlogId } from './event/value-objects/blog.id'
import { LoggerDecorator } from 'src/core/application/decorators/logger.decorator'
import { NestLogger } from 'src/core/infraestructure/logger/nest.logger'
import { DeleteCommentsByTargetCommand } from 'src/comment/application/commands/delete-by-target/delete.by.target'
import { Injectable } from '@nestjs/common'

@Injectable()
export class BlogDeletedCommentEventListener {
    constructor(
        private eventHandler: RabbitMQEventHandler,
        private commentRepository: CommentPostgresRepository,
    ) {
        this.load()
    }

    load() {
        this.eventHandler.listen(
            BLOG_DELETED,
            BLOG_DELETED + '_DELETE_COMMENTS',
            (json) =>
                blogDeleted({
                    id: new BlogId(json.id._id),
                    timestamp: new Date(json.timestamp),
                }),
            async (event) => {
                await new LoggerDecorator(
                    new DeleteCommentsByTargetCommand(
                        this.commentRepository,
                        this.eventHandler,
                    ),
                    new NestLogger('Delete All Comments By Target'),
                ).execute({
                    type: 'BLOG',
                    targetId: event.id.id,
                })
            },
        )
    }
}
