import { Inject, Injectable } from '@nestjs/common'
import { DomainEventStorage } from 'src/core/application/event-storage/event.storage'
import { RabbitMQEventHandler } from 'src/core/infraestructure/event-handler/rabbitmq/rabbit.service'
import { MONGO_EVENT_STORAGE } from 'src/core/infraestructure/event-storage/mongo/mongo.event.storage.module'
import {
    courseTitleChanged,
    COURSE_TITLE_CHANGED,
} from '../../../domain/events/course.title.changed'
import { CourseID } from '../../../domain/value-objects/course.id'
import { CourseTitle } from 'src/course/domain/value-objects/course.title'

@Injectable()
export class courseTitleChangedEventListener {
    constructor(
        private eventHandle: RabbitMQEventHandler,
        @Inject(MONGO_EVENT_STORAGE) private eventStorage: DomainEventStorage,
    ) {
        this.load()
    }
    load() {
        this.eventHandle.listen(
            COURSE_TITLE_CHANGED,
            (json) =>
                courseTitleChanged({
                    id: new CourseID(json.id._id),
                    title: new CourseTitle(json.title._title),
                    timestamp: new Date(json.timestamp),
                }),
            async (event) => {
                await this.eventStorage.save(event)
            },
        )
    }
}
