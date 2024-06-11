import { Lesson } from '../../../../../../src/subscription/domain/entities/lesson'
import { Subscription } from '../../../../../../src/subscription/domain/subscription'
import { ClientID } from '../../../../../../src/subscription/domain/value-objects/client.id'
import { CourseID } from '../../../../../../src/subscription/domain/value-objects/course.id'
import { LessonID } from '../../../../../../src/subscription/domain/value-objects/lesson.id'
import { LessonLastTime } from '../../../../../../src/subscription/domain/value-objects/lesson.last.time'
import { LessonProgress } from '../../../../../../src/subscription/domain/value-objects/lesson.progress'
import { SubscriptionID } from '../../../../../../src/subscription/domain/value-objects/subscription.id'
import { Time } from '../../../../../../src/subscription/domain/value-objects/time'

export const createSubscription = (data: {
    id?: string
    client?: string
    course: string
    startTime?: Date
    lastTime?: Date
    lessons: {
        lessonId: string
        prgress?: number
        lastTime?: number
    }[]
}) =>
    new Subscription(
        new SubscriptionID(data.id ?? 'd90396d7-68b4-45c5-b714-79ed40324594'),
        {
            course: new CourseID(data.course),
            client: new ClientID(
                data.client ?? '930c08fc-2b11-4e30-8377-d21b265fa51a',
            ),
            startTime: new Time(data.startTime ?? new Date()),
            lastTime: new Time(data.lastTime ?? new Date()),
            lessons: data.lessons.map(
                (e) =>
                    new Lesson(new LessonID(e.lessonId), {
                        progress: new LessonProgress(e.prgress ?? 0),
                        lastTime: e.lastTime
                            ? new LessonLastTime(e.lastTime)
                            : undefined,
                    }),
            ),
        },
    )
