import { ApplicationService } from 'src/core/application/service/application.service'
import { GetSubscriptionTrendingDTO } from './types/dto'
import { GetSubscriptionTrendingResponse } from './types/response'
import { Result } from 'src/core/application/result-handler/result.handler'
import { SubscriptionRepository } from '../../repositories/subscription.repository'
import { CourseRepository } from '../../repositories/course.repository'
import { ClientID } from 'src/subscription/domain/value-objects/client.id'
import { subscriptionNotFound } from '../../errors/subscription.not.found'
import { courseNotExist } from '../../errors/course.not.exist'
import { calculateCourseProgress } from 'src/subscription/domain/services/calculate.course.progress'

export class GetSubscriptionTrending
implements
        ApplicationService<
            GetSubscriptionTrendingDTO,
            GetSubscriptionTrendingResponse
        >
{
    constructor(
        private subscriptionRepository: SubscriptionRepository,
        private courseRepository: CourseRepository,
    ) {}
    async execute(
        data: GetSubscriptionTrendingDTO,
    ): Promise<Result<GetSubscriptionTrendingResponse>> {
        const subscription =
            await this.subscriptionRepository.getLastSubscriptionCourse(
                new ClientID(data.client),
            )
        if (!subscription) return Result.error(subscriptionNotFound())
        const course = await this.courseRepository.getById(subscription.course)
        if (!course) return Result.error(courseNotExist())
        return Result.success({
            courseTitle: course.title.title,
            percent: calculateCourseProgress(subscription),
            lastTime: subscription.lastTime.date,
            courseId: course.id.id,
        })
    }
}
