import { Inject, Injectable } from '@nestjs/common'
import { Category } from 'src/blog/domain/entities/category'
import {
    BLOG_CATEGORY_CHANGED,
    blogCategoryChanged,
} from 'src/blog/domain/events/blog.category.changed'
import { BlogId } from 'src/blog/domain/value-objects/blog.id'
import { CategoryId } from 'src/blog/domain/value-objects/category.id'
import { CategoryName } from 'src/blog/domain/value-objects/category.name'
import { DomainEventStorage } from 'src/core/application/event-storage/event.storage'
import { RabbitMQEventHandler } from 'src/core/infraestructure/event-handler/rabbitmq/rabbit.service'
import { MONGO_EVENT_STORAGE } from 'src/core/infraestructure/event-storage/mongo/mongo.event.storage.module'

@Injectable()
export class BlogCategoryChangedEventListener {
    constructor(
        private eventHandler: RabbitMQEventHandler,

        @Inject(MONGO_EVENT_STORAGE)
        private eventStorage: DomainEventStorage,
    ) {
        this.load()
    }

    load() {
        this.eventHandler.listen(
            BLOG_CATEGORY_CHANGED,
            (json) =>
                blogCategoryChanged({
                    id: new BlogId(json.id._id),
                    category: new Category(new CategoryId(json.id._id), {
                        name: new CategoryName(json.category.data.name._name),
                    }),
                    timestamp: new Date(json.timestamp),
                }),
            async (event) => {
                await this.eventStorage.save(event)
            },
        )
    }
}
