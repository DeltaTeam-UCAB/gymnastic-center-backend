import { Inject, Injectable } from '@nestjs/common'
import { DomainEventStorage } from 'src/core/application/event-storage/event.storage'
import { RabbitMQEventHandler } from 'src/core/infraestructure/event-handler/rabbitmq/rabbit.service'
import { MONGO_EVENT_STORAGE } from 'src/core/infraestructure/event-storage/mongo/mongo.event.storage.module'
import {
    courseTagRemoved,
    COURSE_TAG_REMOVED,
} from '../../../domain/events/course.tag.removed'
import { CourseID } from '../../../domain/value-objects/course.id'
import { CourseTag } from 'src/course/domain/value-objects/course.tag'

@Injectable()
export class courseTagRemovedEventListener {
    constructor(
        private eventHandle: RabbitMQEventHandler,
        @Inject(MONGO_EVENT_STORAGE) private eventStorage: DomainEventStorage,
    ) {
        this.load()
    }
    load() {
        this.eventHandle.listen(
            COURSE_TAG_REMOVED,
            COURSE_TAG_REMOVED + '_STORAGE',
            (json) =>
                courseTagRemoved({
                    id: new CourseID(json.id._id),
                    tag: new CourseTag(json.tag._tag),
                    timestamp: new Date(json.timestamp),
                }),
            async (event) => {
                await this.eventStorage.save(event)
            },
        )
    }
}
