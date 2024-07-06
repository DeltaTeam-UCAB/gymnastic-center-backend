import { Inject, Injectable } from '@nestjs/common'
import { DomainEventStorage } from 'src/core/application/event-storage/event.storage'
import { RabbitMQEventHandler } from 'src/core/infraestructure/event-handler/rabbitmq/rabbit.service'
import { MONGO_EVENT_STORAGE } from 'src/core/infraestructure/event-storage/mongo/mongo.event.storage.module'
import {
    COURSE_LESSON_REMOVED,
    courseLessonRemoved,
} from '../../../domain/events/course.lesson.removed'
import { CourseID } from 'src/course/domain/value-objects/course.id'
import { LessonID } from 'src/course/domain/value-objects/lesson.id'

@Injectable()
export class CourseLessonRemovedEventListener {
    constructor(
        private eventHandle: RabbitMQEventHandler,
        @Inject(MONGO_EVENT_STORAGE) private eventStorage: DomainEventStorage,
    ) {
        this.load()
    }
    load() {
        this.eventHandle.listen(
            COURSE_LESSON_REMOVED,
            (json) =>
                courseLessonRemoved({
                    id: new CourseID(json.id._id),
                    lesson: new LessonID(json.lesson._id._id),
                    timestamp: new Date(json.timestamp),
                }),
            async (event) => {
                await this.eventStorage.save(event)
            },
        )
    }
}
