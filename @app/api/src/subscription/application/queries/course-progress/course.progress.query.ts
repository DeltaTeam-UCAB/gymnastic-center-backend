import { ApplicationService } from 'src/core/application/service/application.service'
import { GetCourseProgressDTO } from './types/dto'
import { GetCourseProgressResponse } from './types/response'
import { Result } from 'src/core/application/result-handler/result.handler'
import { SubscriptionRepository } from '../../repositories/subscription.repository'
import { CourseID } from 'src/subscription/domain/value-objects/course.id'
import { ClientID } from 'src/subscription/domain/value-objects/client.id'
import { subscriptionNotFound } from '../../errors/subscription.not.found'
import { calculateCourseProgress } from 'src/subscription/domain/services/calculate.course.progress'

export class GetCourseProgressQuery
implements
        ApplicationService<GetCourseProgressDTO, GetCourseProgressResponse>
{
    constructor(private subscriptionRepository: SubscriptionRepository) {}
    async execute(
        data: GetCourseProgressDTO,
    ): Promise<Result<GetCourseProgressResponse>> {
        const subscription =
            await this.subscriptionRepository.getByCourseAndClient(
                new CourseID(data.course),
                new ClientID(data.client),
            )
        if (!subscription) return Result.error(subscriptionNotFound())
        return Result.success({
            percent: calculateCourseProgress(subscription),
            lessons: subscription.lessons.map((e) => ({
                lessonId: e.id.id,
                time: e.lastTime?.seconds,
                percent: e.progress.percent,
            })),
        })
    }
}
