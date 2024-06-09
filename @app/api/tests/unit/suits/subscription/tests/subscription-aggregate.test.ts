import { Lesson } from '../../../../../src/subscription/domain/entities/lesson'
import { Subscription } from '../../../../../src/subscription/domain/subscription'
import { ClientID } from '../../../../../src/subscription/domain/value-objects/client.id'
import { CourseID } from '../../../../../src/subscription/domain/value-objects/course.id'
import { LessonID } from '../../../../../src/subscription/domain/value-objects/lesson.id'
import { LessonLastTime } from '../../../../../src/subscription/domain/value-objects/lesson.last.time'
import { LessonProgress } from '../../../../../src/subscription/domain/value-objects/lesson.progress'
import { SubscriptionID } from '../../../../../src/subscription/domain/value-objects/subscription.id'
import { Time } from '../../../../../src/subscription/domain/value-objects/time'

export const name = 'Should create a subscription aggregate'
export const body = () => {
    const subscription = new Subscription(
        new SubscriptionID('2c56cdc0-c3f5-4723-974b-82f1b67c25fd'),
        {
            client: new ClientID('9dbad4ae-991b-4237-acdd-aa8c5baead7a'),
            course: new CourseID('eac879af-4155-4e3d-bcc2-8bd01110fc21'),
            startTime: new Time(new Date()),
            lastTime: new Time(new Date()),
            lessons: [
                new Lesson(
                    new LessonID('23e8a84c-5c78-40d3-bdaf-4380de50f562'),
                    {
                        progress: new LessonProgress(0),
                        lastTime: new LessonLastTime(0),
                    },
                ),
            ],
        },
    )
    lookFor(subscription).toBeDefined()
}
