import { Inject, Injectable } from '@nestjs/common'
import { DomainEventStorage } from 'src/core/application/event-storage/event.storage'
import { lessonProgressChanged,
    LESSON_PROGRESS_CHANGED,
 } from 'src/subscription/domain/events/lesson.progress.changed'
import { RabbitMQEventHandler } from 'src/core/infraestructure/event-handler/rabbitmq/rabbit.service'
import { SubscriptionID } from 'src/subscription/domain/value-objects/subscription.id'
import { MONGO_EVENT_STORAGE } from 'src/core/infraestructure/event-storage/mongo/mongo.event.storage.module'
import { LessonID } from 'src/subscription/domain/value-objects/lesson.id'
import { LessonProgress } from 'src/subscription/domain/value-objects/lesson.progress'

@Injectable()
export class LessonProgressChangedEventListener {
    constructor(
        private eventHandle: RabbitMQEventHandler,
        @Inject(MONGO_EVENT_STORAGE) private eventStorage: DomainEventStorage,
    ) {
        this.load()
    }
    load() {
        this.eventHandle.listen(
            LESSON_PROGRESS_CHANGED,
            (json) =>
                lessonProgressChanged({
                id: new SubscriptionID(json.id._id),
                lessonId: new LessonID(json.lessonId._id),
                progress: new LessonProgress(json.progress._percent)
                }),
            async (event) => {
                await this.eventStorage.save(event)
            },
        )
    }
}