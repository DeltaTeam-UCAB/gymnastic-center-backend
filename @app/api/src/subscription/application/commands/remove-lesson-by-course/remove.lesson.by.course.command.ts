import { ApplicationService } from 'src/core/application/service/application.service'
import { Result } from 'src/core/application/result-handler/result.handler'
import { SubscriptionRepository } from '../../repositories/subscription.repository'
import { EventPublisher } from 'src/core/application/event-handler/event.handler'
import { CourseID } from 'src/subscription/domain/value-objects/course.id'
import { LessonID } from 'src/subscription/domain/value-objects/lesson.id'
import { RemoveLessonByCourseDTO } from './types/dto'

export class RemoveLessonByCourseCommand
implements ApplicationService<RemoveLessonByCourseDTO, void>
{
    constructor(
        private subscriptionRepository: SubscriptionRepository,
        private eventPublisher: EventPublisher,
    ) {}
    async execute(data: RemoveLessonByCourseDTO): Promise<Result<void>> {
        const subscriptions = await this.subscriptionRepository.getAllByCourse(
            new CourseID(data.courseId),
        )
        const results = await subscriptions.asyncMap((subscription) => {
            subscription.removeLesson(new LessonID(data.lessonId))
            return this.subscriptionRepository.save(subscription)
        })
        const possibleError = results.find((e) => e.isError())
        if (possibleError) return possibleError.convertToOther()
        const subscriptionsModified = results.map((e) => e.unwrap())
        this.eventPublisher.publish(
            subscriptionsModified.map((e) => e.pullEvents()).flat(),
        )
        return Result.success(undefined)
    }
}
