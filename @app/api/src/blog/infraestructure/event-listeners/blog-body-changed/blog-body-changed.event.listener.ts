import { Inject, Injectable } from '@nestjs/common'
import {
    BLOG_BODY_CHANGED,
    blogBodyChanged,
} from 'src/blog/domain/events/blog.body.changed'
import { BlogBody } from 'src/blog/domain/value-objects/blog.body'
import { BlogId } from 'src/blog/domain/value-objects/blog.id'
import { DomainEventStorage } from 'src/core/application/event-storage/event.storage'
import { RabbitMQEventHandler } from 'src/core/infraestructure/event-handler/rabbitmq/rabbit.service'
import { MONGO_EVENT_STORAGE } from 'src/core/infraestructure/event-storage/mongo/mongo.event.storage.module'

@Injectable()
export class BlogBodyChangedEventListener {
    constructor(
        private eventHandler: RabbitMQEventHandler,

        @Inject(MONGO_EVENT_STORAGE)
        private eventStorage: DomainEventStorage,
    ) {
        this.load()
    }

    load() {
        this.eventHandler.listen(
            BLOG_BODY_CHANGED,
            BLOG_BODY_CHANGED + '_STORAGE',
            (json) =>
                blogBodyChanged({
                    id: new BlogId(json.id._id),
                    body: new BlogBody(json.body._body),
                }),
            async (event) => {
                await this.eventStorage.save(event)
            },
        )
    }
}
