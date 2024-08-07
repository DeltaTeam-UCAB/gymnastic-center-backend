import { Optional } from '@mono/types-utils'
import { Subscription } from '../models/subscription'

export interface SubscriptionRepository {
    getById(id: string): Promise<Optional<Subscription>>
    getManyByCategory(category: string): Promise<Subscription[]>
}
