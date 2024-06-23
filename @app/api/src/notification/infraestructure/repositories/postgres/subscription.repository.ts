import { Optional } from '@mono/types-utils'
import { InjectRepository } from '@nestjs/typeorm'
import { Subscription } from 'src/notification/application/models/subscription'
import { SubscriptionRepository } from 'src/notification/application/repositories/subscription.repository'
import { Subscription as SubscriptionORM } from '../../models/postgres/subscription.entity'
import { Repository } from 'typeorm'
import { SubscriptionLesson } from '../../models/postgres/subscription-lesson.entity'

export class SubscriptionPostgresByNotificationRepository
    implements SubscriptionRepository
{
    constructor(
        @InjectRepository(SubscriptionORM)
        private subscriptionProvider: Repository<SubscriptionORM>,
        @InjectRepository(SubscriptionLesson)
        private subscriptionLesson: Repository<SubscriptionLesson>,
    ) {}
    async getById(id: string): Promise<Optional<Subscription>> {
        const subscription = await this.subscriptionProvider.findOneBy({
            id,
        })
        if (!subscription) return null
        return {
            id: subscription.id,
            course: subscription.course,
            client: subscription.client,
            percent: (
                await this.subscriptionLesson.findBy({
                    subscription: id,
                })
            )
                .map((e) => e.progress)
                .average(),
        }
    }

    async getManyByCategory(category: string): Promise<Subscription[]> {
        const subscriptions = await this.subscriptionProvider
            .createQueryBuilder('s')
            .innerJoinAndSelect('c.courseEntity', 'c')
            .where('c.category = :categoryId', {
                categoryId: category,
            })
            .getMany()
        return subscriptions.map((s) => ({
            id: s.id,
            percent: 0,
            course: s.course,
            client: s.client,
        }))
    }
}
