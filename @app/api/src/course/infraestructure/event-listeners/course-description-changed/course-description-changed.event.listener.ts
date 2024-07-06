import { Inject, Injectable } from '@nestjs/common'
import { DomainEventStorage } from 'src/core/application/event-storage/event.storage'
import { RabbitMQEventHandler } from 'src/core/infraestructure/event-handler/rabbitmq/rabbit.service'
import { MONGO_EVENT_STORAGE } from 'src/core/infraestructure/event-storage/mongo/mongo.event.storage.module'
import {
    COURSE_DESCRIPTION_CHANGED,
    courseDescriptionChanged,
} from '../../../domain/events/course.description.changed'
import { CourseID } from '../../../domain/value-objects/course.id'
import { CourseDescription } from 'src/course/domain/value-objects/course.description'

@Injectable()
export class CourseDescriptionChangedEventListener {
    constructor(
        private eventHandle: RabbitMQEventHandler,
        @Inject(MONGO_EVENT_STORAGE) private eventStorage: DomainEventStorage,
    ) {
        this.load()
    }
    load() {
        this.eventHandle.listen(
            COURSE_DESCRIPTION_CHANGED,
            (json) =>
                courseDescriptionChanged({
                    id: new CourseID(json.id._id),
                    description: new CourseDescription(
                        json.description._description,
                    ),
                    timestamp: new Date(json.timestamp),
                }),
            async (event) => {
                await this.eventStorage.save(event)
            },
        )
    }
}
