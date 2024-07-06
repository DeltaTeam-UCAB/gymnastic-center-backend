import { Inject, Injectable } from '@nestjs/common'
import { Category } from 'src/blog/domain/entities/category'
import { Trainer } from 'src/blog/domain/entities/trainer'
import { BLOG_CREATED, blogCreated } from 'src/blog/domain/events/blog.created'
import { BlogBody } from 'src/blog/domain/value-objects/blog.body'
import { BlogId } from 'src/blog/domain/value-objects/blog.id'
import { BlogImage } from 'src/blog/domain/value-objects/blog.images'
import { BlogTag } from 'src/blog/domain/value-objects/blog.tag'
import { BlogTitle } from 'src/blog/domain/value-objects/blog.title'
import { CategoryId } from 'src/blog/domain/value-objects/category.id'
import { CategoryName } from 'src/blog/domain/value-objects/category.name'
import { TrainerId } from 'src/blog/domain/value-objects/trainer.id'
import { TrainerName } from 'src/blog/domain/value-objects/trainer.name'
import { DomainEventStorage } from 'src/core/application/event-storage/event.storage'
import { RabbitMQEventHandler } from 'src/core/infraestructure/event-handler/rabbitmq/rabbit.service'
import { MONGO_EVENT_STORAGE } from 'src/core/infraestructure/event-storage/mongo/mongo.event.storage.module'

@Injectable()
export class BlogCreatedEventListener {
    constructor(
        private eventHandler: RabbitMQEventHandler,

        @Inject(MONGO_EVENT_STORAGE)
        private eventStorage: DomainEventStorage,
    ) {
        this.load()
    }

    load() {
        this.eventHandler.listen(
            BLOG_CREATED,
            (json) =>
                blogCreated({
                    id: new BlogId(json.id._id),
                    title: new BlogTitle(json.title._title),
                    body: new BlogBody(json.body._body),
                    images: (json.images as any[]).map(
                        (img) => new BlogImage(img._image),
                    ),
                    tags: (json.tags as any[]).map(
                        (tag) => new BlogTag(tag._tag),
                    ),
                    trainer: new Trainer(new TrainerId(json.id._id), {
                        name: new TrainerName(json.trainer.data.name._name),
                    }),
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
