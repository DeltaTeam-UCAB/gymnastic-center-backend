import { Inject, Injectable } from '@nestjs/common'
import { DomainEventStorage } from 'src/core/application/event-storage/event.storage'
import { RabbitMQEventHandler } from 'src/core/infraestructure/event-handler/rabbitmq/rabbit.service'
import { MONGO_EVENT_STORAGE } from 'src/core/infraestructure/event-storage/mongo/mongo.event.storage.module'
import {
    COMMENT_CREATED,
    commentCreated,
} from 'src/comment/domain/events/comment.created'
import { CommentID } from 'src/comment/domain/value-objects/comment.id'
import { CommentContent } from 'src/comment/domain/value-objects/comment.content'
import { Client } from 'src/comment/domain/entities/client'
import { ClientID } from 'src/comment/domain/value-objects/client.id'
import { Target } from 'src/comment/domain/value-objects/target'
import { LessonID } from 'src/comment/domain/value-objects/lesson.id'
import { ClientName } from 'src/comment/domain/value-objects/client.name'
import { BlogID } from 'src/comment/domain/value-objects/blog.id'

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
            COMMENT_CREATED + '_STORAGE',
            (json) =>
                commentCreated({
                    id: new CommentID(json.id._id),
                    content: new CommentContent(json.content._content),
                    client: new Client(new ClientID(json.client._id._id), {
                        name: new ClientName(json.client.data.name._name),
                    }),
                    whoLiked: (json.whoLiked as Record<any, any>[]).map(
                        (client) => new ClientID(client._id),
                    ),
                    whoDisliked: (json.whoDisliked as Record<any, any>[]).map(
                        (client) => new ClientID(client._id),
                    ),
                    target: json.target._lessonId
                        ? Target.lesson(new LessonID(json.target._lessonId._id))
                        : Target.blog(new BlogID(json.target._blogId._id)),
                    timestamp: new Date(json.timestamp),
                }),
            async (event) => {
                await this.eventStorage.save(event)
            },
        )
    }
}
