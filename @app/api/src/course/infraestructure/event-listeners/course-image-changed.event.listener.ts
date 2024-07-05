import { Inject, Injectable } from '@nestjs/common'
import { DomainEventStorage } from 'src/core/application/event-storage/event.storage'
import { RabbitMQEventHandler } from 'src/core/infraestructure/event-handler/rabbitmq/rabbit.service'
import { MONGO_EVENT_STORAGE } from 'src/core/infraestructure/event-storage/mongo/mongo.event.storage.module'
import {
    COURSE_IMAGE_CHANGED,
    courseImageChanged,
} from '../../domain/events/course.image.changed'
import { CourseID } from '../../domain/value-objects/course.id'
import { CourseImage } from 'src/course/domain/value-objects/course.image'

@Injectable()
export class courseImageChangedEventListener {
    constructor(
        private eventHandle: RabbitMQEventHandler,
        @Inject(MONGO_EVENT_STORAGE) private eventStorage: DomainEventStorage,
    ) {
        this.load()
    }
    load() {
        this.eventHandle.listen(
            COURSE_IMAGE_CHANGED,
            (json) =>
                courseImageChanged({
                    id: new CourseID(json.id._id),
                    image: new CourseImage(json.image),
                    timestamp: new Date(json.timestamp),
                }),
            async (event) => {
                await this.eventStorage.save(event)
            },
        )
    }
}
