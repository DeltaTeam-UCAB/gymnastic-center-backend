import { Inject, Injectable } from '@nestjs/common'
import { DomainEventStorage } from 'src/core/application/event-storage/event.storage'
import { RabbitMQEventHandler } from 'src/core/infraestructure/event-handler/rabbitmq/rabbit.service'
import { MONGO_EVENT_STORAGE } from 'src/core/infraestructure/event-storage/mongo/mongo.event.storage.module'
import { Lesson } from 'src/subscription/domain/entities/lesson'
import {
    SUBSCRIPTION_CREATED,
    subscriptionCreated,
} from 'src/subscription/domain/events/subscription.created'
import { ClientID } from 'src/subscription/domain/value-objects/client.id'
import { CourseID } from 'src/subscription/domain/value-objects/course.id'
import { LessonID } from 'src/subscription/domain/value-objects/lesson.id'
import { LessonLastTime } from 'src/subscription/domain/value-objects/lesson.last.time'
import { LessonProgress } from 'src/subscription/domain/value-objects/lesson.progress'
import { SubscriptionID } from 'src/subscription/domain/value-objects/subscription.id'
import { Time } from 'src/subscription/domain/value-objects/time'

@Injectable()
export class SubscriptionCreatedEventListener {
    constructor(
        private eventHandle: RabbitMQEventHandler,
        @Inject(MONGO_EVENT_STORAGE) private eventStorage: DomainEventStorage,
    ) {
        this.load()
    }
    load() {
        this.eventHandle.listen(
            SUBSCRIPTION_CREATED,
            SUBSCRIPTION_CREATED + '_STORAGE',
            (json) =>
                subscriptionCreated({
                    id: new SubscriptionID(json.id._id),
                    client: new ClientID(json.client._id),
                    course: new CourseID(json.course._id),
                    lastTime: new Time(new Date(json.lastTime._date)),
                    startTime: new Time(new Date(json.startTime._date)),
                    timestamp: new Date(json.timestamp),
                    lessons: (json.lessons as Record<any, any>[]).map(
                        (lesson) =>
                            new Lesson(new LessonID(lesson._id._id), {
                                lastTime: lesson.data.lastTime
                                    ? new LessonLastTime(
                                          lesson.data.lastTime._seconds,
                                      )
                                    : undefined,
                                progress: new LessonProgress(
                                    lesson.data.progress._percent,
                                ),
                            }),
                    ),
                }),
            async (event) => {
                await this.eventStorage.save(event)
            },
        )
    }
}
