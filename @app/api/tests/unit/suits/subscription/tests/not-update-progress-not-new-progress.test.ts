import { createCourse } from './utils/course.factory'
import { createSubscription } from './utils/subscription.factory'
import { SubscriptionRepositoryMock } from './utils/subscription.repository.mock'
import { UpdateSubscriptionCommand } from '../../../../../src/subscription/application/commands/update/update.command'
import { DateProviderMock } from './utils/date.provider.mock'

export const name =
    'Should not update subscription progress becaurse not have a new progress'
export const body = async () => {
    const lessonId = 'e3fc36c4-6b09-4aee-8d6c-73cdcc371052'
    const course = createCourse({
        lessons: [lessonId],
    })
    const subscription = createSubscription({
        course: course.id.id,
        lessons: [
            {
                lessonId,
                prgress: 40,
            },
        ],
    })
    const subscriptionRepository = new SubscriptionRepositoryMock([
        subscription,
    ])
    const result = await new UpdateSubscriptionCommand(
        subscriptionRepository,
        new DateProviderMock(),
    ).execute({
        course: course.id.id,
        client: subscription.client.id,
        time: 30,
        totalTime: 100,
        markAsCompleted: false,
        lesson: lessonId,
    })
    lookFor(result.isError()).equals(false)
    const subscriptionUpdated =
        await subscriptionRepository.getByCourseAndClient(
            subscription.course,
            subscription.client,
        )
    lookFor(subscriptionUpdated).toBeDefined()
    lookFor(subscriptionUpdated?.lessons.length).equals(1)
    subscriptionUpdated?.lessons.forEach((e) => {
        lookFor(e.id.id).equals(lessonId)
        lookFor(e.progress.percent).equals(40)
        lookFor(e.lastTime?.seconds).equals(30)
    })
}
