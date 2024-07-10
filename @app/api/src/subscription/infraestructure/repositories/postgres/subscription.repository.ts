import { Optional } from '@mono/types-utils'
import { InjectRepository } from '@nestjs/typeorm'
import { Result } from 'src/core/application/result-handler/result.handler'
import { SubscriptionRepository } from 'src/subscription/application/repositories/subscription.repository'
import { Subscription } from 'src/subscription/domain/subscription'
import { ClientID } from 'src/subscription/domain/value-objects/client.id'
import { CourseID } from 'src/subscription/domain/value-objects/course.id'
import { Subscription as SubscriptionORM } from '../../models/postgres/subscription.entity'
import { Repository } from 'typeorm'
import { SubscriptionLesson } from '../../models/postgres/subscription-lesson.entity'
import { SubscriptionID } from 'src/subscription/domain/value-objects/subscription.id'
import { Time } from 'src/subscription/domain/value-objects/time'
import { Lesson } from 'src/subscription/domain/entities/lesson'
import { LessonID } from 'src/subscription/domain/value-objects/lesson.id'
import { LessonLastTime } from 'src/subscription/domain/value-objects/lesson.last.time'
import { LessonProgress } from 'src/subscription/domain/value-objects/lesson.progress'

export class SubscriptionPostgresRepository implements SubscriptionRepository {
    constructor(
        @InjectRepository(SubscriptionORM)
        private subscriptionProvider: Repository<SubscriptionORM>,
        @InjectRepository(SubscriptionLesson)
        private subscriptionLessonProvider: Repository<SubscriptionLesson>,
    ) {}
    async save(subscription: Subscription): Promise<Result<Subscription>> {
        await this.subscriptionProvider.upsert(
            this.subscriptionProvider.create({
                id: subscription.id.id,
                course: subscription.course.id,
                client: subscription.client.id,
                startDate: subscription.startTime.date,
                endDate: subscription.lastTime.date,
            }),
            ['id'],
        )
        await this.subscriptionLessonProvider.delete({
            subscription: subscription.id.id,
        })
        await subscription.lessons.asyncForEach((lesson) =>
            this.subscriptionLessonProvider.insert(
                this.subscriptionLessonProvider.create({
                    subscription: subscription.id.id,
                    lesson: lesson.id.id,
                    progress: lesson.progress.percent,
                    lastTime: lesson.lastTime?.seconds,
                }),
            ),
        )
        return Result.success(subscription)
    }

    async getByCourseAndClient(
        course: CourseID,
        client: ClientID,
    ): Promise<Optional<Subscription>> {
        const subscription = await this.subscriptionProvider.findOneBy({
            course: course.id,
            client: client.id,
        })
        if (!subscription) return null
        return new Subscription(new SubscriptionID(subscription.id), {
            client: new ClientID(subscription.client),
            course: new CourseID(subscription.course),
            startTime: new Time(subscription.startDate),
            lastTime: new Time(subscription.endDate),
            lessons: await this.subscriptionLessonProvider
                .findBy({
                    subscription: subscription.id,
                })
                .map(
                    (lesson) =>
                        new Lesson(new LessonID(lesson.lesson), {
                            lastTime: lesson.lastTime
                                ? new LessonLastTime(lesson.lastTime)
                                : undefined,
                            progress: new LessonProgress(lesson.progress),
                        }),
                ),
        })
    }

    async getLastSubscriptionCourse(
        client: ClientID,
    ): Promise<Optional<Subscription>> {
        const subscription = await this.subscriptionProvider.findOne({
            order: {
                endDate: 'DESC',
            },
            where: {
                client: client.id,
            },
        })
        if (!subscription) return null
        return new Subscription(new SubscriptionID(subscription.id), {
            client: new ClientID(subscription.client),
            course: new CourseID(subscription.course),
            startTime: new Time(subscription.startDate),
            lastTime: new Time(subscription.endDate),
            lessons: await this.subscriptionLessonProvider
                .findBy({
                    subscription: subscription.id,
                })
                .map(
                    (lesson) =>
                        new Lesson(new LessonID(lesson.lesson), {
                            lastTime: lesson.lastTime
                                ? new LessonLastTime(lesson.lastTime)
                                : undefined,
                            progress: new LessonProgress(lesson.progress),
                        }),
                ),
        })
    }

    async delete(subscription: Subscription): Promise<Result<Subscription>> {
        await this.subscriptionLessonProvider.delete({
            subscription: subscription.id.id,
        })
        await this.subscriptionProvider.delete({
            id: subscription.id.id,
        })
        return Result.success(subscription)
    }

    async getAllByCourse(course: CourseID): Promise<Subscription[]> {
        const subscriptions = await this.subscriptionProvider.findBy({
            course: course.id,
        })
        return subscriptions.asyncMap(
            async (subscription) =>
                new Subscription(new SubscriptionID(subscription.id), {
                    client: new ClientID(subscription.client),
                    course: new CourseID(subscription.course),
                    startTime: new Time(subscription.startDate),
                    lastTime: new Time(subscription.endDate),
                    lessons: await this.subscriptionLessonProvider
                        .findBy({
                            subscription: subscription.id,
                        })
                        .map(
                            (lesson) =>
                                new Lesson(new LessonID(lesson.lesson), {
                                    lastTime: lesson.lastTime
                                        ? new LessonLastTime(lesson.lastTime)
                                        : undefined,
                                    progress: new LessonProgress(
                                        lesson.progress,
                                    ),
                                }),
                        ),
                }),
        )
    }
}
