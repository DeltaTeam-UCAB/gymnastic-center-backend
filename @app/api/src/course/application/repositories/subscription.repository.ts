import { Subscription } from 'src/course/domain/entities/subscription'
import { ClientID } from 'src/course/domain/value-objects/client.id'

export type GetManySuscriptionsData = {
    page: number
    perPage: number
    client: ClientID
}
export interface SubscriptionRepository {
    getManyByClientID(data: GetManySuscriptionsData): Promise<Subscription[]>
}
