import { Injectable } from '@nestjs/common'
import { RabbitMQEventHandler } from 'src/core/infraestructure/event-handler/rabbitmq/rabbit.service'
import { CourseID } from './event/value-objects/course.id'
import { LessonID } from './event/value-objects/lesson.id'
import { LoggerDecorator } from 'src/core/application/decorators/logger.decorator'
import { DomainErrorParserDecorator } from 'src/core/application/decorators/domain.error.parser'
import { NestLogger } from 'src/core/infraestructure/logger/nest.logger'
import {
    COURSE_LESSON_REMOVED,
    courseLessonRemoved,
} from './event/course.lesson.removed'
import { RemoveLessonByCourseCommand } from 'src/subscription/application/commands/remove-lesson-by-course/remove.lesson.by.course.command'
import { SubscriptionPostgresRepository } from '../../repositories/postgres/subscription.repository'

@Injectable()
export class CourseLessonRemovedEventListener {
    constructor(
        private eventHandler: RabbitMQEventHandler,
        private subscriptionRepository: SubscriptionPostgresRepository,
    ) {
        this.load()
    }

    load() {
        this.eventHandler.listen(
            COURSE_LESSON_REMOVED,
            COURSE_LESSON_REMOVED + '_SYNC_SUBSCRIPTIONS',
            (json) =>
                courseLessonRemoved({
                    id: new CourseID(json.id._id),
                    lesson: new LessonID(json.lesson._id),
                }),
            async (event) => {
                await new LoggerDecorator(
                    new DomainErrorParserDecorator(
                        new RemoveLessonByCourseCommand(
                            this.subscriptionRepository,
                            this.eventHandler,
                        ),
                    ),
                    new NestLogger('Remove subscriptions lesson'),
                ).execute({
                    courseId: event.id.id,
                    lessonId: event.lesson.id,
                })
            },
        )
    }
}
