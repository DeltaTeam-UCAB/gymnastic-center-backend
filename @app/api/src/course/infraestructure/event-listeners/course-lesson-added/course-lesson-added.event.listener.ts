import { Inject, Injectable } from '@nestjs/common'
import { DomainEventStorage } from 'src/core/application/event-storage/event.storage'
import { RabbitMQEventHandler } from 'src/core/infraestructure/event-handler/rabbitmq/rabbit.service'
import { MONGO_EVENT_STORAGE } from 'src/core/infraestructure/event-storage/mongo/mongo.event.storage.module'
import {
    COURSE_LESSON_ADDED,
    courseLessonAdded,
} from '../../../domain/events/course.lesson.added'
import { CourseID } from 'src/course/domain/value-objects/course.id'
import { Lesson } from 'src/course/domain/entities/lesson'
import { LessonID } from 'src/course/domain/value-objects/lesson.id'
import { LessonTitle } from 'src/course/domain/value-objects/lesson.title'
import { LessonContent } from 'src/course/domain/value-objects/lesson.content'
import { LessonVideo } from 'src/course/domain/value-objects/lesson.video'

@Injectable()
export class CourseLessonAddedEventListener {
    constructor(
        private eventHandle: RabbitMQEventHandler,
        @Inject(MONGO_EVENT_STORAGE) private eventStorage: DomainEventStorage,
    ) {
        this.load()
    }
    load() {
        this.eventHandle.listen(
            COURSE_LESSON_ADDED,
            (json) =>
                courseLessonAdded({
                    id: new CourseID(json.id._id),
                    timestamp: new Date(json.timestamp),
                    lesson: new Lesson(new LessonID(json.lesson._id._id), {
                        title: new LessonTitle(json.lesson.data.title._title),
                        content: new LessonContent(
                            json.lesson.data.content._content,
                        ),
                        video: new LessonVideo(json.lesson.data.video._video),
                    }),
                }),
            async (event) => {
                await this.eventStorage.save(event)
            },
        )
    }
}
