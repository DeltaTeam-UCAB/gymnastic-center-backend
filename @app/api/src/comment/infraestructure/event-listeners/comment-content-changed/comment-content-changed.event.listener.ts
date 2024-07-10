import { Inject, Injectable } from '@nestjs/common'
import { DomainEventStorage } from 'src/core/application/event-storage/event.storage'
import { RabbitMQEventHandler } from 'src/core/infraestructure/event-handler/rabbitmq/rabbit.service'
import { MONGO_EVENT_STORAGE } from 'src/core/infraestructure/event-storage/mongo/mongo.event.storage.module'
import {
    COMMENT_CONTENT_CHANGED,
    commentContentChanged,
} from 'src/comment/domain/events/comment.content.changed'
import { CommentID } from 'src/comment/domain/value-objects/comment.id'
import { CommentContent } from 'src/comment/domain/value-objects/comment.content'

@Injectable()
export class CommentContentChangedEventListener {
    constructor(
        private eventHandle: RabbitMQEventHandler,
        @Inject(MONGO_EVENT_STORAGE) private eventStorage: DomainEventStorage,
    ) {
        this.load()
    }
    load() {
        this.eventHandle.listen(
            COMMENT_CONTENT_CHANGED,
            COMMENT_CONTENT_CHANGED + '_STORAGE',
            (json) =>
                commentContentChanged({
                    id: new CommentID(json.id._id),
                    content: new CommentContent(json.content._content),
                    timestamp: new Date(json.timestamp),
                }),
            async (event) => {
                await this.eventStorage.save(event)
            },
        )
    }
}
