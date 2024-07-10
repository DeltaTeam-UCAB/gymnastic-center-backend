import { Injectable } from '@nestjs/common'
import { RabbitMQEventHandler } from 'src/core/infraestructure/event-handler/rabbitmq/rabbit.service'
import { SubscriptionPostgresRepository } from '../../repositories/postgres/subscription.repository'
import { COURSE_DELETED, courseDeleted } from './event/course.deleted'
import { CourseID } from './event/value-objects/course.id'
import { LoggerDecorator } from 'src/core/application/decorators/logger.decorator'
import { DeleteSubscriptionsByCourseCommand } from 'src/subscription/application/commands/delete-by-course/delete.by.course.command'
import { NestLogger } from 'src/core/infraestructure/logger/nest.logger'

@Injectable()
export class CourseDeletedEventListener {
    constructor(
        private eventHandler: RabbitMQEventHandler,
        private subscriptionRepository: SubscriptionPostgresRepository,
    ) {
        this.load()
    }
    load() {
        this.eventHandler.listen(
            COURSE_DELETED,
            COURSE_DELETED + '_DELETE_SUBSCRIPTIONS',
            (json) =>
                courseDeleted({
                    id: new CourseID(json.id._id),
                    timestamp: new Date(json.timestamp),
                }),
            async (event) => {
                await new LoggerDecorator(
                    new DeleteSubscriptionsByCourseCommand(
                        this.subscriptionRepository,
                        this.eventHandler,
                    ),
                    new NestLogger('Delete subscriptions by course'),
                ).execute({
                    courseId: event.id.id,
                })
            },
        )
    }
}
