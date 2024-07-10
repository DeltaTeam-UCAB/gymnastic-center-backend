import { Optional } from '@mono/types-utils'
import { Result } from 'src/core/application/result-handler/result.handler'
import { SubscriptionRepository } from 'src/subscription/application/repositories/subscription.repository'
import { Subscription } from 'src/subscription/domain/subscription'
import { ClientID } from 'src/subscription/domain/value-objects/client.id'
import { CourseID } from 'src/subscription/domain/value-objects/course.id'
import { Subscription as SubscriptionORM } from '../../models/postgres/subscription.entity'
import { QueryRunner } from 'typeorm'
import { SubscriptionLesson } from '../../models/postgres/subscription-lesson.entity'
import { SubscriptionID } from 'src/subscription/domain/value-objects/subscription.id'
import { Time } from 'src/subscription/domain/value-objects/time'
import { Lesson } from 'src/subscription/domain/entities/lesson'
import { LessonID } from 'src/subscription/domain/value-objects/lesson.id'
import { LessonLastTime } from 'src/subscription/domain/value-objects/lesson.last.time'
import { LessonProgress } from 'src/subscription/domain/value-objects/lesson.progress'

export class SubscriptionPostgresRepositoryTransactional
implements SubscriptionRepository
{
    constructor(private queryRunner: QueryRunner) {}
    async save(subscription: Subscription): Promise<Result<Subscription>> {
        await this.queryRunner.manager.upsert(
            SubscriptionORM,
            this.queryRunner.manager.create(SubscriptionORM, {
                id: subscription.id.id,
                course: subscription.course.id,
                client: subscription.client.id,
                startDate: subscription.startTime.date,
                endDate: subscription.lastTime.date,
            }),
            ['id'],
        )
        await this.queryRunner.manager.delete(SubscriptionLesson, {
            subscription: subscription.id.id,
        })
        await subscription.lessons.asyncForEach((lesson) =>
            this.queryRunner.manager.insert(
                SubscriptionLesson,
                this.queryRunner.manager.create(SubscriptionLesson, {
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
        const subscription = await this.queryRunner.manager.findOneBy(
            SubscriptionORM,
            {
                course: course.id,
                client: client.id,
            },
        )
        if (!subscription) return null
        return new Subscription(new SubscriptionID(subscription.id), {
            client: new ClientID(subscription.client),
            course: new CourseID(subscription.course),
            startTime: new Time(subscription.startDate),
            lastTime: new Time(subscription.endDate),
            lessons: await this.queryRunner.manager
                .findBy(SubscriptionLesson, {
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
        const subscription = await this.queryRunner.manager.findOne(
            SubscriptionORM,
            {
                order: {
                    endDate: 'ASC',
                },
                where: {
                    client: client.id,
                },
            },
        )
        if (!subscription) return null
        return new Subscription(new SubscriptionID(subscription.id), {
            client: new ClientID(subscription.client),
            course: new CourseID(subscription.course),
            startTime: new Time(subscription.startDate),
            lastTime: new Time(subscription.endDate),
            lessons: await this.queryRunner.manager
                .findBy(SubscriptionLesson, {
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
        await this.queryRunner.manager.delete(SubscriptionLesson, {
            subscription: subscription.id.id,
        })
        await this.queryRunner.manager.delete(SubscriptionORM, {
            id: subscription.id.id,
        })
        return Result.success(subscription)
    }

    async getAllByCourse(course: CourseID): Promise<Subscription[]> {
        const subscriptions = await this.queryRunner.manager.findBy(
            SubscriptionORM,
            {
                course: course.id,
            },
        )
        return subscriptions.asyncMap(
            async (subscription) =>
                new Subscription(new SubscriptionID(subscription.id), {
                    client: new ClientID(subscription.client),
                    course: new CourseID(subscription.course),
                    startTime: new Time(subscription.startDate),
                    lastTime: new Time(subscription.endDate),
                    lessons: await this.queryRunner.manager
                        .findBy(SubscriptionLesson, {
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

    countByClient(client: ClientID): Promise<number> {
        return this.queryRunner.manager.count(SubscriptionORM, {
            where: {
                client: client.id,
            },
        })
    }
}
