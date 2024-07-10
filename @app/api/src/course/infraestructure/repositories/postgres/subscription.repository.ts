import { InjectRepository } from '@nestjs/typeorm'
import {
    GetManySuscriptionsData,
    SubscriptionRepository,
} from 'src/course/application/repositories/subscription.repository'
import { Subscription } from 'src/course/domain/entities/subscription'
import { Subscription as SubscriptionORM } from '../../models/postgres/subscription.entity'
import { Repository } from 'typeorm'
import { SubscriptionLesson } from '../../models/postgres/subscription-lesson.entity'
import { SubscriptionID } from 'src/course/domain/value-objects/subscription.id'
import { ClientID } from 'src/course/domain/value-objects/client.id'
import { CourseID } from 'src/course/domain/value-objects/course.id'
import { SubscriptionProgress } from 'src/course/domain/value-objects/subscription.progress'
import { Injectable } from '@nestjs/common'

@Injectable()
export class SubscriptionPostgresByCourseRepository
implements SubscriptionRepository
{
    constructor(
        @InjectRepository(SubscriptionORM)
        private subscriptionProvider: Repository<SubscriptionORM>,
        @InjectRepository(SubscriptionLesson)
        private subscriptionLessonProvider: Repository<SubscriptionLesson>,
    ) {}
    getManyByClientID(data: GetManySuscriptionsData): Promise<Subscription[]> {
        return this.subscriptionProvider
            .find({
                skip: data.perPage * (data.page - 1),
                take: data.perPage,
                where: {
                    client: data.client.id,
                },
                order: {
                    endDate: 'DESC',
                },
            })
            .map(
                async (subscription) =>
                    new Subscription(new SubscriptionID(subscription.id), {
                        client: new ClientID(subscription.client),
                        course: new CourseID(subscription.course),
                        progress: new SubscriptionProgress(
                            (
                                await this.subscriptionLessonProvider
                                    .findBy({
                                        subscription: subscription.id,
                                    })
                                    .map((e) => e.progress)
                            ).average() ?? 100,
                        ),
                    }),
            )
    }
}
