import { Subscription } from '../../../../../../src/subscription/domain/subscription'
import { SubscriptionRepository } from '../../../../../../src/subscription/application/repositories/subscription.repository'
import { CourseID } from '../../../../../../src/subscription/domain/value-objects/course.id'
import { ClientID } from '../../../../../../src/subscription/domain/value-objects/client.id'
import { Result } from '../../../../../../src/core/application/result-handler/result.handler'
import { Optional } from '@mono/types-utils'

export class SubscriptionRepositoryMock implements SubscriptionRepository {
    constructor(private subscriptions: Subscription[] = []) {}
    async save(subscription: Subscription): Promise<Result<Subscription>> {
        this.subscriptions = this.subscriptions.filter(
            (e) => e.id == subscription.id,
        )
        this.subscriptions.push(subscription)
        return Result.success(subscription)
    }

    async getByCourseAndClient(
        course: CourseID,
        client: ClientID,
    ): Promise<Optional<Subscription>> {
        return this.subscriptions.find(
            (e) => e.client == client && e.course == course,
        )
    }

    async getLastSubscriptionCourse(
        client: ClientID,
    ): Promise<Optional<Subscription>> {
        return this.subscriptions.find((e) => e.client == client)
    }
}
