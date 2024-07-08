import { Injectable } from '@nestjs/common'
import { BlogPostgresRepository } from '../../repositories/postgres/blog.repository'
import { RabbitMQEventHandler } from 'src/core/infraestructure/event-handler/rabbitmq/rabbit.service'
import { TRAINER_DELETED, trainerDeleted } from './event/trainer.deleted'
import { LoggerDecorator } from 'src/core/application/decorators/logger.decorator'
import { NestLogger } from 'src/core/infraestructure/logger/nest.logger'
import { DeleteBlogsByTrainerCommand } from 'src/blog/application/commands/delete-by-trainer/delete-by-trainer.blog.command'
import { TrainerID } from './event/value-objects/trainer.id'

@Injectable()
export class TrainerDeletedBlogEventListener {
    constructor(
        private eventHandler: RabbitMQEventHandler,
        private blogRepository: BlogPostgresRepository,
    ) {
        this.load()
    }

    load() {
        this.eventHandler.listen(
            TRAINER_DELETED,
            TRAINER_DELETED + '_DELETE_BLOGS',
            (json) =>
                trainerDeleted({
                    id: new TrainerID(json.id._id),
                    timestamp: new Date(json.timestamp),
                }),
            async (event) => {
                await new LoggerDecorator(
                    new DeleteBlogsByTrainerCommand(
                        this.blogRepository,
                        this.eventHandler,
                    ),
                    new NestLogger('Delete All Blogs By Trainer'),
                ).execute({
                    id: event.id.id,
                })
            },
        )
    }
}
