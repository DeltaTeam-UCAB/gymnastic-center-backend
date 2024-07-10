import { Inject, Injectable } from '@nestjs/common'
import { Trainer } from 'src/blog/domain/entities/trainer'
import {
    BLOG_TRAINER_CHANGED,
    blogTrainerChanged,
} from 'src/blog/domain/events/blog.trainer.changed'
import { BlogId } from 'src/blog/domain/value-objects/blog.id'
import { TrainerId } from 'src/blog/domain/value-objects/trainer.id'
import { TrainerName } from 'src/blog/domain/value-objects/trainer.name'
import { DomainEventStorage } from 'src/core/application/event-storage/event.storage'
import { RabbitMQEventHandler } from 'src/core/infraestructure/event-handler/rabbitmq/rabbit.service'
import { MONGO_EVENT_STORAGE } from 'src/core/infraestructure/event-storage/mongo/mongo.event.storage.module'

@Injectable()
export class BlogTrainerChangedEventListener {
    constructor(
        private eventHandler: RabbitMQEventHandler,

        @Inject(MONGO_EVENT_STORAGE)
        private eventStorage: DomainEventStorage,
    ) {
        this.load()
    }

    load() {
        this.eventHandler.listen(
            BLOG_TRAINER_CHANGED,
            BLOG_TRAINER_CHANGED + '_STORAGE',
            (json) =>
                blogTrainerChanged({
                    id: new BlogId(json.id._id),
                    trainer: new Trainer(new TrainerId(json.id._id), {
                        name: new TrainerName(json.trainer.data.name._name),
                    }),
                }),
            async (event) => {
                await this.eventStorage.save(event)
            },
        )
    }
}
