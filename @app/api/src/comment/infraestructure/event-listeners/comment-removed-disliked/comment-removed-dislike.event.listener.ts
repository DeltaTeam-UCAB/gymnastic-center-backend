import { Inject, Injectable } from '@nestjs/common'
import { DomainEventStorage } from 'src/core/application/event-storage/event.storage'
import { RabbitMQEventHandler } from 'src/core/infraestructure/event-handler/rabbitmq/rabbit.service'
import { MONGO_EVENT_STORAGE } from 'src/core/infraestructure/event-storage/mongo/mongo.event.storage.module'
import {
    COMMENT_REMOVED_DISLIKE,
    commentRemovedDislike,
} from 'src/comment/domain/events/comment.removed.dislike'
import { CommentID } from 'src/comment/domain/value-objects/comment.id'
import { ClientID } from 'src/comment/domain/value-objects/client.id'

@Injectable()
export class CommentRemovedDislikeEventListener {
    constructor(
        private eventHandle: RabbitMQEventHandler,
        @Inject(MONGO_EVENT_STORAGE) private eventStorage: DomainEventStorage,
    ) {
        this.load()
    }
    load() {
        this.eventHandle.listen(
            COMMENT_REMOVED_DISLIKE,
            (json) =>
                commentRemovedDislike({
                    id: new CommentID(json.id._id),
                    whoRemovedDislike: new ClientID(json.whoRemovedDislike._id),
                    timestamp: new Date(json.timestamp),
                }),
            async (event) => {
                await this.eventStorage.save(event)
            },
        )
    }
}
