import { Inject, Injectable } from '@nestjs/common'
import {
    BLOG_IMAGE_REMOVED,
    blogImageRemoved,
} from 'src/blog/domain/events/blog.image.removed'
import { BlogId } from 'src/blog/domain/value-objects/blog.id'
import { BlogImage } from 'src/blog/domain/value-objects/blog.images'
import { DomainEventStorage } from 'src/core/application/event-storage/event.storage'
import { RabbitMQEventHandler } from 'src/core/infraestructure/event-handler/rabbitmq/rabbit.service'
import { MONGO_EVENT_STORAGE } from 'src/core/infraestructure/event-storage/mongo/mongo.event.storage.module'

@Injectable()
export class BlogImageRemoveEventListener {
    constructor(
        private eventHandler: RabbitMQEventHandler,

        @Inject(MONGO_EVENT_STORAGE)
        private eventStorage: DomainEventStorage,
    ) {
        this.load()
    }

    load() {
        this.eventHandler.listen(
            BLOG_IMAGE_REMOVED,
            BLOG_IMAGE_REMOVED + '_STORAGE',
            (json) =>
                blogImageRemoved({
                    id: new BlogId(json.id._id),
                    image: new BlogImage(json.image._image),
                }),
            async (event) => {
                await this.eventStorage.save(event)
            },
        )
    }
}
