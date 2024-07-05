import { Optional } from '@mono/types-utils'
import { Result } from 'src/core/application/result-handler/result.handler'
import { Subscription } from 'src/subscription/domain/subscription'
import { ClientID } from 'src/subscription/domain/value-objects/client.id'
import { CourseID } from 'src/subscription/domain/value-objects/course.id'

export interface SubscriptionRepository {
    save(subscription: Subscription): Promise<Result<Subscription>>
    getByCourseAndClient(
        course: CourseID,
        client: ClientID,
    ): Promise<Optional<Subscription>>
    getLastSubscriptionCourse(client: ClientID): Promise<Optional<Subscription>>
    delete(subscription: Subscription): Promise<Result<Subscription>>
    getAllByCourse(course: CourseID): Promise<Subscription[]>
}
