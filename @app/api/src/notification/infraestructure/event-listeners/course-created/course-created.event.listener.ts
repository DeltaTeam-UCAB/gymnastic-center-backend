import { Inject } from '@nestjs/common'
import { IDGenerator } from 'src/core/application/ID/ID.generator'
import { UUID_GEN_NATIVE } from 'src/core/infraestructure/UUID/module/UUID.module'
import { CoursePostgresByNotificationRepository } from '../../repositories/postgres/course.repository'
import { SubscriptionPostgresByNotificationRepository } from '../../repositories/postgres/subscription.repository'
import { NotificationPostgresRepository } from '../../repositories/postgres/notification.repository'
import { RabbitMQEventHandler } from 'src/core/infraestructure/event-handler/rabbitmq/rabbit.service'
import { COURSE_CREATED, courseCreated } from './event/course.created'
import { CourseID } from './event/value-objects/course.id'
import { CourseTag } from './event/value-objects/course.tag'
import { CourseImage } from './event/value-objects/course.image'
import { CourseLevel } from './event/value-objects/course.level'
import { CourseTitle } from './event/value-objects/course.title'
import { CourseDuration } from './event/value-objects/course.duration'
import { CourseDescription } from './event/value-objects/course.description'
import { Trainer } from './event/entities/trainer'
import { TrainerID } from './event/value-objects/trainer.id'
import { TrainerName } from './event/value-objects/trainer.name'
import { Category } from './event/entities/category'
import { CategoryID } from './event/value-objects/category.id'
import { CategoryName } from './event/value-objects/category.name'
import { CourseRecomendationPolicy } from 'src/notification/application/policies/course-recomendation/recomend.course.policy'
import { CreateNotificationCommand } from 'src/notification/application/commands/create/create.notification.command'
import { ConcreteDateProvider } from 'src/core/infraestructure/date/date.provider'
import { CategoryPostgresByNotificationRepository } from '../../repositories/postgres/category.repository'
import { LoggerDecorator } from 'src/core/application/decorators/logger.decorator'
import { NestLogger } from 'src/core/infraestructure/logger/nest.logger'

export class CourseCreatedEventListener {
    constructor(
        private eventHandler: RabbitMQEventHandler,
        private notificationRepository: NotificationPostgresRepository,
        private subscriptionRepository: SubscriptionPostgresByNotificationRepository,
        private courseRepository: CoursePostgresByNotificationRepository,
        private categoryRepository: CategoryPostgresByNotificationRepository,
        @Inject(UUID_GEN_NATIVE) private idGenerator: IDGenerator<string>,
    ) {
        this.load()
    }

    load() {
        this.eventHandler.listen(
            COURSE_CREATED,
            (json) =>
                courseCreated({
                    id: new CourseID(json.id._id),
                    tags: (json.tags as any[]).map(
                        (e) => new CourseTag(e._tag),
                    ),
                    image: new CourseImage(json.image._image),
                    level: new CourseLevel(json.level._level),
                    title: new CourseTitle(json.title._title),
                    duration: new CourseDuration(
                        json.duration._weeks,
                        json.duration._hours,
                    ),
                    description: new CourseDescription(
                        json.description._description,
                    ),
                    trainer: new Trainer(new TrainerID(json.trainer._id._id), {
                        name: new TrainerName(json.trainer.data.name._name),
                    }),
                    category: new Category(
                        new CategoryID(json.category._id._id),
                        {
                            name: new CategoryName(
                                json.category.data.name._name,
                            ),
                        },
                    ),
                    lessons: [],
                    timestamp: new Date(json.timestamp),
                }),
            async (event) => {
                await new CourseRecomendationPolicy(
                    new LoggerDecorator(
                        new CreateNotificationCommand(
                            this.idGenerator,
                            this.notificationRepository,
                            new ConcreteDateProvider(),
                        ),
                        new NestLogger('Create notification'),
                    ),
                    this.courseRepository,
                    this.subscriptionRepository,
                    this.categoryRepository,
                ).execute({
                    courseId: event.id.id,
                    categoryId: event.category.id.id,
                })
            },
        )
    }
}
