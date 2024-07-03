import { Optional } from '@mono/types-utils'
import { Subscription } from 'src/course/domain/entities/subscription'
import { ClientID } from 'src/course/domain/value-objects/client.id'
import { CourseID } from 'src/course/domain/value-objects/course.id'

export type GetManySuscriptionsData = {
    page: number
    perPage: number
    client: ClientID
}
export interface SubscriptionRepository {
    getById(id: string): Promise<Optional<Subscription>>
    getByCourseAndClient(
        courseId: CourseID,
        clientId: ClientID,
    ): Promise<Optional<Subscription>>
    getManyByClientID(data: GetManySuscriptionsData): Promise<Subscription[]>
    getByCourseID(courseID: CourseID): Promise<Optional<Subscription>>
}
