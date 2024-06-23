import { ApplicationService } from 'src/core/application/service/application.service'
import { CreateSubscriptionDTO } from './types/dto'
import { CreateSubscriptionResponse } from './types/response'
import { Result } from 'src/core/application/result-handler/result.handler'
import { IDGenerator } from 'src/core/application/ID/ID.generator'
import { SubscriptionRepository } from '../../repositories/subscription.repository'
import { CourseRepository } from '../../repositories/course.repository'
import { CourseID } from 'src/subscription/domain/value-objects/course.id'
import { ClientID } from 'src/subscription/domain/value-objects/client.id'
import { subscriptionExist } from '../../errors/subscription.exist'
import { courseNotExist } from '../../errors/course.not.exist'
import { Subscription } from 'src/subscription/domain/subscription'
import { SubscriptionID } from 'src/subscription/domain/value-objects/subscription.id'
import { DateProvider } from 'src/core/application/date/date.provider'
import { Time } from 'src/subscription/domain/value-objects/time'
import { Lesson } from 'src/subscription/domain/entities/lesson'
import { LessonProgress } from 'src/subscription/domain/value-objects/lesson.progress'
import { EventPublisher } from 'src/core/application/event-handler/event.handler'

export class CreateSubscriptionCommand
    implements
        ApplicationService<CreateSubscriptionDTO, CreateSubscriptionResponse>
{
    constructor(
        private idGenerator: IDGenerator<string>,
        private subscriptionRepository: SubscriptionRepository,
        private courseRepository: CourseRepository,
        private dateProvider: DateProvider,
        private eventPublisher: EventPublisher,
    ) {}
    async execute(
        data: CreateSubscriptionDTO,
    ): Promise<Result<CreateSubscriptionResponse>> {
        const possibleSubscription =
            await this.subscriptionRepository.getByCourseAndClient(
                new CourseID(data.course),
                new ClientID(data.client),
            )
        if (possibleSubscription) return Result.error(subscriptionExist())
        const course = await this.courseRepository.getById(
            new CourseID(data.course),
        )
        if (!course) return Result.error(courseNotExist())
        const subscription = new Subscription(
            new SubscriptionID(this.idGenerator.generate()),
            {
                client: new ClientID(data.client),
                course: new CourseID(data.course),
                startTime: new Time(this.dateProvider.current),
                lastTime: new Time(this.dateProvider.current),
                lessons: course.lessons.map(
                    (e) =>
                        new Lesson(e, {
                            progress: LessonProgress.createEmpty(),
                        }),
                ),
            },
        )
        const result = await this.subscriptionRepository.save(subscription)
        if (result.isError()) return result.convertToOther()
        this.eventPublisher.publish(subscription.pullEvents())
        return Result.success({
            id: subscription.id.id,
        })
    }
}
