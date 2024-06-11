import { DomainService } from 'src/core/domain/service/domain.service'
import { Subscription } from '../subscription'

export const calculateCourseProgress: DomainService<Subscription, number> = (
    subscription,
) => {
    return subscription.lessons.map((e) => e.progress.percent).average()
}
