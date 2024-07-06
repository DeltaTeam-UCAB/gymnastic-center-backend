import { Inject, Injectable } from '@nestjs/common'
import { DomainEventStorage } from 'src/core/application/event-storage/event.storage'
import { RabbitMQEventHandler } from 'src/core/infraestructure/event-handler/rabbitmq/rabbit.service'
import { MONGO_EVENT_STORAGE } from 'src/core/infraestructure/event-storage/mongo/mongo.event.storage.module'
import {
    COMMENT_DISLIKED,
    commentDisliked,
} from 'src/comment/domain/events/comment.disliked'
import { CommentID } from 'src/comment/domain/value-objects/comment.id'
import { ClientID } from 'src/comment/domain/value-objects/client.id'

@Injectable()
export class CommentDislikedEventListener {
    constructor(
        private eventHandle: RabbitMQEventHandler,
        @Inject(MONGO_EVENT_STORAGE) private eventStorage: DomainEventStorage,
    ) {
        this.load()
    }
    load() {
        this.eventHandle.listen(
            COMMENT_DISLIKED,
            (json) =>
                commentDisliked({
                    id: new CommentID(json.id._id),
                    whoDisliked: new ClientID(json.whoDisliked._id),
                    timestamp: new Date(json.timestamp),
                }),
            async (event) => {
                await this.eventStorage.save(event)
            },
        )
    }
}
