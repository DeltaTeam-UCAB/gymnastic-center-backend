import { Inject, Injectable } from '@nestjs/common'
import { DomainEventStorage } from 'src/core/application/event-storage/event.storage'
import { RabbitMQEventHandler } from 'src/core/infraestructure/event-handler/rabbitmq/rabbit.service'
import { MONGO_EVENT_STORAGE } from 'src/core/infraestructure/event-storage/mongo/mongo.event.storage.module'
import {
    COURSE_LEVEL_CHANGED,
    courseLevelChanged,
} from '../../../domain/events/course.level.changed'
import { CourseID } from '../../../domain/value-objects/course.id'
import { CourseLevel } from 'src/course/domain/value-objects/course.level'

@Injectable()
export class courseLevelChangedEventListener {
    constructor(
        private eventHandle: RabbitMQEventHandler,
        @Inject(MONGO_EVENT_STORAGE) private eventStorage: DomainEventStorage,
    ) {
        this.load()
    }
    load() {
        this.eventHandle.listen(
            COURSE_LEVEL_CHANGED,
            (json) =>
                courseLevelChanged({
                    id: new CourseID(json.id._id),
                    level: new CourseLevel(json.level._level),
                    timestamp: new Date(json.timestamp),
                }),
            async (event) => {
                await this.eventStorage.save(event)
            },
        )
    }
}
