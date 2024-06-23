import { ApplicationService } from 'src/core/application/service/application.service'
import { UpadeSubscriptionDTO } from './types/dto'
import { UpdateSubscriptionResponse } from './types/response'
import { Result } from 'src/core/application/result-handler/result.handler'
import { SubscriptionRepository } from '../../repositories/subscription.repository'
import { DateProvider } from 'src/core/application/date/date.provider'
import { CourseID } from 'src/subscription/domain/value-objects/course.id'
import { ClientID } from 'src/subscription/domain/value-objects/client.id'
import { subscriptionNotFound } from '../../errors/subscription.not.found'
import { LessonID } from 'src/subscription/domain/value-objects/lesson.id'
import { LessonLastTime } from 'src/subscription/domain/value-objects/lesson.last.time'
import { Time } from 'src/subscription/domain/value-objects/time'
import { updateLessonProgress } from 'src/subscription/domain/services/update.lesson.progress'
import { EventPublisher } from 'src/core/application/event-handler/event.handler'

export class UpdateSubscriptionCommand
implements
        ApplicationService<UpadeSubscriptionDTO, UpdateSubscriptionResponse>
{
    constructor(
        private subscriptionRepository: SubscriptionRepository,
        private dateProvider: DateProvider,
        private eventPublisher: EventPublisher,
    ) {}
    async execute(
        data: UpadeSubscriptionDTO,
    ): Promise<Result<UpdateSubscriptionResponse>> {
        const subscription =
            await this.subscriptionRepository.getByCourseAndClient(
                new CourseID(data.course),
                new ClientID(data.client),
            )
        if (!subscription) return Result.error(subscriptionNotFound())
        subscription.changeLastTime(new Time(this.dateProvider.current))
        subscription.changeLessonLastTime(
            new LessonID(data.lesson),
            new LessonLastTime(data.time),
        )
        updateLessonProgress({
            subscription,
            lesson: new LessonID(data.lesson),
            time: data.time,
            totalTime: data.totalTime,
            markAsCompleted: data.markAsCompleted,
        })
        const result = await this.subscriptionRepository.save(subscription)
        if (result.isError()) return result.convertToOther()
        this.eventPublisher.publish(subscription.pullEvents())
        return Result.success({
            id: subscription.id.id,
        })
    }
}
