import { Injectable } from '@nestjs/common'
import { RabbitMQEventHandler } from 'src/core/infraestructure/event-handler/rabbitmq/rabbit.service'
import {
    COURSE_LESSON_ADDED,
    courseLessonAdded,
} from './event/course.lesson.added'
import { CourseID } from './event/value-objects/course.id'
import { Lesson } from './event/entities/lesson'
import { LessonID } from './event/value-objects/lesson.id'
import { LessonVideo } from './event/value-objects/lesson.video'
import { LessonTitle } from './event/value-objects/lesson.title'
import { LessonContent } from './event/value-objects/lesson.content'
import { LoggerDecorator } from 'src/core/application/decorators/logger.decorator'
import { DomainErrorParserDecorator } from 'src/core/application/decorators/domain.error.parser'
import { AddLessonByCourseCommand } from 'src/subscription/application/commands/add-lesson-by-course/add.lesson.by.course.command'
import { NestLogger } from 'src/core/infraestructure/logger/nest.logger'
import { SubscriptionPostgresRepository } from '../../repositories/postgres/subscription.repository'

@Injectable()
export class CourseLessonAddedEventListener {
    constructor(
        private eventHandler: RabbitMQEventHandler,
        private subscriptionRepository: SubscriptionPostgresRepository,
    ) {
        this.load()
    }

    load() {
        this.eventHandler.listen(
            COURSE_LESSON_ADDED,
            (json) =>
                courseLessonAdded({
                    id: new CourseID(json.id._id),
                    lesson: new Lesson(new LessonID(json.lesson._id._id), {
                        video: new LessonVideo(json.lesson.data.video._video),
                        title: new LessonTitle(json.lesson.data.title._title),
                        content: new LessonContent(
                            json.lesson.data.content._content,
                        ),
                    }),
                }),
            async (event) => {
                await new LoggerDecorator(
                    new DomainErrorParserDecorator(
                        new AddLessonByCourseCommand(
                            this.subscriptionRepository,
                            this.eventHandler,
                        ),
                    ),
                    new NestLogger('Add subscriptions lesson'),
                ).execute({
                    courseId: event.id.id,
                    lessonId: event.lesson.id.id,
                })
            },
        )
    }
}
