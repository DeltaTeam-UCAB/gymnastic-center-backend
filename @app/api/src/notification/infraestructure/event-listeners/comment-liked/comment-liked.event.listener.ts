import { Inject, Injectable } from '@nestjs/common'
import { RabbitMQEventHandler } from 'src/core/infraestructure/event-handler/rabbitmq/rabbit.service'
import { CommentPostgresByNotificationRepository } from '../../repositories/postgres/comment.repository'
import { ClientPostgresByNotificationRepository } from '../../repositories/postgres/client.repository'
import { COMMENT_LIKED, commentLiked } from './event/comment.liked'
import { CommentID } from './event/value-objects/comment.id'
import { ClientID } from './event/value-objects/client.id'
import { NotificationPostgresRepository } from '../../repositories/postgres/notification.repository'
import { UUID_GEN_NATIVE } from 'src/core/infraestructure/UUID/module/UUID.module'
import { IDGenerator } from 'src/core/application/ID/ID.generator'
import { CommentLikedPolicy } from 'src/notification/application/policies/comment-liked/comment.liked.policy'
import { CreateNotificationCommand } from 'src/notification/application/commands/create/create.notification.command'
import { ConcreteDateProvider } from 'src/core/infraestructure/date/date.provider'
import { LoggerDecorator } from 'src/core/application/decorators/logger.decorator'
import { NestLogger } from 'src/core/infraestructure/logger/nest.logger'
import { NotificationDecorator } from 'src/notification/application/commands/create/decorators/notification.decorator'
import { FirebaseNotificationManager } from '../../firebase/firebase.notification.manager'

@Injectable()
export class CommentLikedEventListener {
    constructor(
        private eventHandler: RabbitMQEventHandler,
        private commentRepository: CommentPostgresByNotificationRepository,
        private clientRepository: ClientPostgresByNotificationRepository,
        private notificationRepository: NotificationPostgresRepository,
        @Inject(UUID_GEN_NATIVE) private uuidGenerator: IDGenerator<string>,
    ) {
        this.load()
    }
    load() {
        this.eventHandler.listen(
            COMMENT_LIKED,
            COMMENT_LIKED + '_NOTIFY_LIKE',
            (json) =>
                commentLiked({
                    id: new CommentID(json.id._id),
                    whoLiked: new ClientID(json.whoLiked._id),
                    timestamp: new Date(json.timestamp),
                }),
            async (event) => {
                await new CommentLikedPolicy(
                    new LoggerDecorator(
                        new NotificationDecorator(
                            new CreateNotificationCommand(
                                this.uuidGenerator,
                                this.notificationRepository,
                                new ConcreteDateProvider(),
                            ),
                            new FirebaseNotificationManager(),
                        ),
                        new NestLogger('Create notification'),
                    ),
                    this.commentRepository,
                    this.clientRepository,
                ).execute({
                    comment: event.id.id,
                    client: event.whoLiked.id,
                })
            },
        )
    }
}
