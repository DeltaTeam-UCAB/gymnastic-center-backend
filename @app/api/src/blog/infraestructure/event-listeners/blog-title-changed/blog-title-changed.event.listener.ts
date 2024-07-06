import { Inject, Injectable } from '@nestjs/common'
import {
    BLOG_TITLE_CHANGED,
    blogTitleChanged,
} from 'src/blog/domain/events/blog.title.changed'
import { BlogId } from 'src/blog/domain/value-objects/blog.id'
import { BlogTitle } from 'src/blog/domain/value-objects/blog.title'
import { DomainEventStorage } from 'src/core/application/event-storage/event.storage'
import { RabbitMQEventHandler } from 'src/core/infraestructure/event-handler/rabbitmq/rabbit.service'
import { MONGO_EVENT_STORAGE } from 'src/core/infraestructure/event-storage/mongo/mongo.event.storage.module'

@Injectable()
export class BlogTitleChangedEventListener {
    constructor(
        private eventHandler: RabbitMQEventHandler,

        @Inject(MONGO_EVENT_STORAGE)
        private eventStorage: DomainEventStorage,
    ) {
        this.load()
    }

    load() {
        this.eventHandler.listen(
            BLOG_TITLE_CHANGED,
            (json) =>
                blogTitleChanged({
                    id: new BlogId(json.id._id),
                    title: new BlogTitle(json.title._title),
                }),
            async (event) => {
                await this.eventStorage.save(event)
            },
        )
    }
}
