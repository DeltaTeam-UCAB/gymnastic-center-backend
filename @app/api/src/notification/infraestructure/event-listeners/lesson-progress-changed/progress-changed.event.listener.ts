import { Inject, Injectable } from '@nestjs/common'
import { RabbitMQEventHandler } from 'src/core/infraestructure/event-handler/rabbitmq/rabbit.service'
import {
    LESSON_PROGRESS_CHANGED,
    lessonProgressChanged,
} from './event/lesson.progress.changed'
import { SubscriptionID } from './event/value-objects/subscription.id'
import { LessonID } from './event/value-objects/lesson.id'
import { LessonProgress } from './event/value-objects/lesson.progress'
import { CourseCompletePolicy } from 'src/notification/application/policies/course-complete/course.complete.policy'
import { CreateNotificationCommand } from 'src/notification/application/commands/create/create.notification.command'
import { NotificationPostgresRepository } from '../../repositories/postgres/notification.repository'
import { SubscriptionPostgresByNotificationRepository } from '../../repositories/postgres/subscription.repository'
import { CoursePostgresByNotificationRepository } from '../../repositories/postgres/course.repository'
import { UUID_GEN_NATIVE } from 'src/core/infraestructure/UUID/module/UUID.module'
import { IDGenerator } from 'src/core/application/ID/ID.generator'
import { ConcreteDateProvider } from 'src/core/infraestructure/date/date.provider'
import { LoggerDecorator } from 'src/core/application/decorators/logger.decorator'
import { NestLogger } from 'src/core/infraestructure/logger/nest.logger'

@Injectable()
export class ProgressChangedEventListener {
    constructor(
        private eventHandler: RabbitMQEventHandler,
        private notificationRepository: NotificationPostgresRepository,
        private subscriptionRepository: SubscriptionPostgresByNotificationRepository,
        private courseRepository: CoursePostgresByNotificationRepository,
        @Inject(UUID_GEN_NATIVE) private idGenerator: IDGenerator<string>,
    ) {
        this.load()
    }
    load() {
        this.eventHandler.listen(
            LESSON_PROGRESS_CHANGED,
            (json) =>
                lessonProgressChanged({
                    id: new SubscriptionID(json.id._id),
                    timestamp: new Date(json.timestamp),
                    lessonId: new LessonID(json.lessonId._id),
                    progress: new LessonProgress(json.progress._percent),
                }),
            async (event) => {
                await new CourseCompletePolicy(
                    new LoggerDecorator(
                        new CreateNotificationCommand(
                            this.idGenerator,
                            this.notificationRepository,
                            new ConcreteDateProvider(),
                        ),
                        new NestLogger('Create notification'),
                    ),
                    this.subscriptionRepository,
                    this.courseRepository,
                ).execute(event.id.id)
            },
        )
    }
}
