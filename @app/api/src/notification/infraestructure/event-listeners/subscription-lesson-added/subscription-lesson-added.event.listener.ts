import { Inject, Injectable } from '@nestjs/common'
import { RabbitMQEventHandler } from 'src/core/infraestructure/event-handler/rabbitmq/rabbit.service'
import { NotificationPostgresRepository } from '../../repositories/postgres/notification.repository'
import { SubscriptionPostgresByNotificationRepository } from '../../repositories/postgres/subscription.repository'
import { CoursePostgresByNotificationRepository } from '../../repositories/postgres/course.repository'
import { UUID_GEN_NATIVE } from 'src/core/infraestructure/UUID/module/UUID.module'
import { IDGenerator } from 'src/core/application/ID/ID.generator'
import {
    SUBSCRIPTION_LESSON_ADDED,
    lessonAdded,
} from './event/subscription.lesson.added'
import { SubscriptionID } from './event/value-objects/subscription.id'
import { LessonID } from './event/value-objects/lesson.id'
import { SubscriptionLessonAddedPolicy } from 'src/notification/application/policies/subscription-lesson-added/subscription.lesson.added.policy'
import { NestLogger } from 'src/core/infraestructure/logger/nest.logger'
import { FirebaseNotificationManager } from '../../firebase/firebase.notification.manager'
import { ConcreteDateProvider } from 'src/core/infraestructure/date/date.provider'
import { CreateNotificationCommand } from 'src/notification/application/commands/create/create.notification.command'
import { NotificationDecorator } from 'src/notification/application/commands/create/decorators/notification.decorator'
import { LoggerDecorator } from 'src/core/application/decorators/logger.decorator'
import { Lesson } from './event/entities/lesson'
import { LessonProgress } from './event/value-objects/lesson.progress'

@Injectable()
export class SubscriptionLessonAdded {
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
            SUBSCRIPTION_LESSON_ADDED,
            SUBSCRIPTION_LESSON_ADDED + '_NOTIFY_NEW_CHALLENGS',
            (json) =>
                lessonAdded({
                    id: new SubscriptionID(json.id._id),
                    timestamp: new Date(json.timestamp),
                    lesson: new Lesson(new LessonID(json.lesson._id._id), {
                        progress: new LessonProgress(
                            json.lesson.data.progress._percent,
                        ),
                    }),
                }),
            async (event) => {
                await new SubscriptionLessonAddedPolicy(
                    new LoggerDecorator(
                        new NotificationDecorator(
                            new CreateNotificationCommand(
                                this.idGenerator,
                                this.notificationRepository,
                                new ConcreteDateProvider(),
                            ),
                            new FirebaseNotificationManager(),
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
