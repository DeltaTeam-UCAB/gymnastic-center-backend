import { Optional } from '@mono/types-utils'
import { Subscription } from '../models/subscription'

export type GetManySuscriptionsData = {
    page: number
    perPage: number
    client: string
}
export interface SubscriptionRepository {
    getById(id: string): Promise<Optional<Subscription>>
    getByCourseAndClient(
        courseId: string,
        clientId: string,
    ): Promise<Optional<Subscription>>
    getManyByClientID(data: GetManySuscriptionsData): Promise<Subscription[]>
    getByCourseID(courseID: string): Promise<Optional<Subscription>>
}
