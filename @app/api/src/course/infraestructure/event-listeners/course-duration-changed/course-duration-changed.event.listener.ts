import { Inject, Injectable } from '@nestjs/common'
import { DomainEventStorage } from 'src/core/application/event-storage/event.storage'
import { RabbitMQEventHandler } from 'src/core/infraestructure/event-handler/rabbitmq/rabbit.service'
import { MONGO_EVENT_STORAGE } from 'src/core/infraestructure/event-storage/mongo/mongo.event.storage.module'
import {
    COURSE_DURATION_CHANGED,
    courseDurationChanged,
} from '../../../domain/events/course.duration.changed'
import { CourseID } from '../../../domain/value-objects/course.id'
import { CourseDuration } from 'src/course/domain/value-objects/course.duration'

@Injectable()
export class courseDurationChangedEventListener {
    constructor(
        private eventHandle: RabbitMQEventHandler,
        @Inject(MONGO_EVENT_STORAGE) private eventStorage: DomainEventStorage,
    ) {
        this.load()
    }
    load() {
        this.eventHandle.listen(
            COURSE_DURATION_CHANGED,
            (json) =>
                courseDurationChanged({
                    id: new CourseID(json.id._id),
                    duration: new CourseDuration(
                        json.duration._weeks,
                        json.duration._hours,
                    ),
                    timestamp: new Date(json.timestamp),
                }),
            async (event) => {
                await this.eventStorage.save(event)
            },
        )
    }
}
