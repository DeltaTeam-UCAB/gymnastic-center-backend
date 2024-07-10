import { Inject, Injectable } from '@nestjs/common'
import { DomainEventStorage } from 'src/core/application/event-storage/event.storage'
import {
    lessonLastTimeChanged,
    LESSON_LAST_TIME_CHANGED,
} from 'src/subscription/domain/events/lesson.last.time.changed'
import { RabbitMQEventHandler } from 'src/core/infraestructure/event-handler/rabbitmq/rabbit.service'
import { SubscriptionID } from 'src/subscription/domain/value-objects/subscription.id'
import { MONGO_EVENT_STORAGE } from 'src/core/infraestructure/event-storage/mongo/mongo.event.storage.module'
import { LessonID } from 'src/subscription/domain/value-objects/lesson.id'
import { LessonLastTime } from 'src/subscription/domain/value-objects/lesson.last.time'

@Injectable()
export class LessonLastTimeChangedEventListener {
    constructor(
        private eventHandle: RabbitMQEventHandler,
        @Inject(MONGO_EVENT_STORAGE) private eventStorage: DomainEventStorage,
    ) {
        this.load()
    }
    load() {
        this.eventHandle.listen(
            LESSON_LAST_TIME_CHANGED,
            LESSON_LAST_TIME_CHANGED + '_STORAGE',
            (json) =>
                lessonLastTimeChanged({
                    id: new SubscriptionID(json.id._id),
                    lessonId: new LessonID(json.lessonId._id),
                    lastTime: new LessonLastTime(json.lastTime._seconds),
                }),
            async (event) => {
                await this.eventStorage.save(event)
            },
        )
    }
}
