import { Inject, Injectable } from '@nestjs/common'
import { DomainEventStorage } from 'src/core/application/event-storage/event.storage'
import { RabbitMQEventHandler } from 'src/core/infraestructure/event-handler/rabbitmq/rabbit.service'
import { MONGO_EVENT_STORAGE } from 'src/core/infraestructure/event-storage/mongo/mongo.event.storage.module'
import {
    COMMENT_CREATED,
    commentCreated,
} from 'src/comment/domain/events/comment.created'
import { ClientID } from 'src/comment/domain/value-objects/client.id'
import { CommentID } from 'src/comment/domain/value-objects/comment.id'
import { CommentContent } from 'src/comment/domain/value-objects/comment.content'
import { Client } from 'src/comment/domain/entities/client'
import { Target } from 'src/comment/domain/value-objects/target'

@Injectable()
export class CommentCreatedEventListener {
    constructor(
        private eventHandle: RabbitMQEventHandler,
        @Inject(MONGO_EVENT_STORAGE) private eventStorage: DomainEventStorage,
    ) {
        this.load()
    }
    load() {
        this.eventHandle.listen(
            COMMENT_CREATED,
            (json) =>
                commentCreated({
                    id: new CommentID(json.id._id),
                    content: new CommentContent(json.content._content),
                    client: new Client(json.client._id, json.client.data),
                    whoLiked: (json.whoLiked as Record<any, any>[]).map(
                        (cliendid) => new ClientID(cliendid._id),
                    ),
                    whoDisliked: (json.whoDisliked as Record<any, any>[]).map(
                        (cliendid) => new ClientID(cliendid._id),
                    ),
                    target:
                        Target.blog(json.target._blogId) ||
                        Target.lesson(json.target._lessonId),
                }),
            async (event) => {
                await this.eventStorage.save(event)
            },
        )
    }
}
