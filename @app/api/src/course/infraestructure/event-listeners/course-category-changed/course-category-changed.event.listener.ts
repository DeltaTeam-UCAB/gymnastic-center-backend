import { Inject, Injectable } from '@nestjs/common'
import { DomainEventStorage } from 'src/core/application/event-storage/event.storage'
import { RabbitMQEventHandler } from 'src/core/infraestructure/event-handler/rabbitmq/rabbit.service'
import { MONGO_EVENT_STORAGE } from 'src/core/infraestructure/event-storage/mongo/mongo.event.storage.module'
import {
    COURSE_CATEGORY_CHANGED,
    courseCategoryChanged,
} from '../../../domain/events/course.category.changed'
import { CourseID } from '../../../domain/value-objects/course.id'
import { CategoryID } from '../../../domain/value-objects/category.id'
import { Category } from 'src/course/domain/entities/category'
import { CategoryName } from 'src/course/domain/value-objects/category.name'

@Injectable()
export class CourseCategoryChangedEventListener {
    constructor(
        private eventHandle: RabbitMQEventHandler,
        @Inject(MONGO_EVENT_STORAGE) private eventStorage: DomainEventStorage,
    ) {
        this.load()
    }
    load() {
        this.eventHandle.listen(
            COURSE_CATEGORY_CHANGED,
            (json) =>
                courseCategoryChanged({
                    id: new CourseID(json.id._id),
                    category: new Category(
                        new CategoryID(json.category._id._id),
                        {
                            name: new CategoryName(
                                json.category.data.name._name,
                            ),
                        },
                    ),
                    timestamp: new Date(json.timestamp),
                }),
            async (event) => {
                await this.eventStorage.save(event)
            },
        )
    }
}
