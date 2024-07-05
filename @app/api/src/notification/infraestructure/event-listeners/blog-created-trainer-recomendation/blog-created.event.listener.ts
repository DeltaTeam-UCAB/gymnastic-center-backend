import { Inject, Injectable } from '@nestjs/common'
import { RabbitMQEventHandler } from 'src/core/infraestructure/event-handler/rabbitmq/rabbit.service'
import { NotificationPostgresRepository } from '../../repositories/postgres/notification.repository'
import { TrainerPostgresByNotificationRepository } from '../../repositories/postgres/trainer.repository'
import { IDGenerator } from 'src/core/application/ID/ID.generator'
import { UUID_GEN_NATIVE } from 'src/core/infraestructure/UUID/module/UUID.module'
import { BlogPostgresByNotificationRepository } from '../../repositories/postgres/blog.repository'
import { BLOG_CREATED, blogCreated } from './event/blog.created'
import { BlogId } from './event/value-objects/blog.id'
import { BlogTag } from './event/value-objects/blog.tag'
import { BlogTitle } from './event/value-objects/blog.title'
import { BlogBody } from './event/value-objects/blog.body'
import { Trainer } from './event/entities/trainer'
import { TrainerId } from './event/value-objects/trainer.id'
import { TrainerName } from './event/value-objects/trainer.name'
import { Category } from './event/entities/category'
import { CategoryId } from './event/value-objects/category.id'
import { CategoryName } from './event/value-objects/category.name'
import { BlogImage } from './event/value-objects/blog.images'
import { LoggerDecorator } from 'src/core/application/decorators/logger.decorator'
import { NotificationDecorator } from 'src/notification/application/commands/create/decorators/notification.decorator'
import { CreateNotificationCommand } from 'src/notification/application/commands/create/create.notification.command'
import { ConcreteDateProvider } from 'src/core/infraestructure/date/date.provider'
import { FirebaseNotificationManager } from '../../firebase/firebase.notification.manager'
import { NestLogger } from 'src/core/infraestructure/logger/nest.logger'
import { TrainerBlogRecomendationPolicy } from 'src/notification/application/policies/blog-trainer-suggestion/trainer.blog.suggestion.policy'

@Injectable()
export class BolgCreatedTrainerRecomendationEventListener {
    constructor(
        private eventHandler: RabbitMQEventHandler,
        private notificationRepository: NotificationPostgresRepository,
        private trainerRepository: TrainerPostgresByNotificationRepository,
        private blogRepository: BlogPostgresByNotificationRepository,
        @Inject(UUID_GEN_NATIVE) private idGenerator: IDGenerator<string>,
    ) {
        this.load()
    }
    load() {
        this.eventHandler.listen(
            BLOG_CREATED,
            (json) => {
                console.log(json)
                return blogCreated({
                    id: new BlogId(json.id._id),
                    tags: (json.tags as any[]).map((e) => new BlogTag(e._tag)),
                    images: (json.images as any[]).map(
                        (e) => new BlogImage(e._image),
                    ),
                    title: new BlogTitle(json.title._title),
                    body: new BlogBody(json.body._body),
                    trainer: new Trainer(new TrainerId(json.trainer._id._id), {
                        name: new TrainerName(json.trainer.data.name._name),
                    }),
                    category: new Category(
                        new CategoryId(json.category._id._id),
                        {
                            name: new CategoryName(
                                json.category.data.name._name,
                            ),
                        },
                    ),
                    timestamp: new Date(json.timestamp),
                })
            },
            async (event) => {
                await new TrainerBlogRecomendationPolicy(
                    new LoggerDecorator(
                        new NotificationDecorator(
                            new CreateNotificationCommand(
                                this.idGenerator,
                                this.notificationRepository,
                                new ConcreteDateProvider(),
                            ),
                            new FirebaseNotificationManager(),
                        ),
                        new NestLogger('Create notification'),
                    ),
                    this.blogRepository,
                    this.trainerRepository,
                ).execute({
                    trainerId: event.trainer.id.id,
                    blogId: event.id.id,
                })
            },
        )
    }
}
