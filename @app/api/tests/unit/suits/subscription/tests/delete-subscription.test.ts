import { createCourse } from './utils/course.factory'
import { createSubscription } from './utils/subscription.factory'
import { SubscriptionRepositoryMock } from './utils/subscription.repository.mock'
import { Result } from '../../../../../src/core/application/result-handler/result.handler'
import { DeleteSubscriptionCommand } from '../../../../../src/subscription/application/commands/delete/delete.subscription.command'
import { eventPublisherStub } from './utils/event.publisher.stup'
import { DeleteSubscriptionResponse } from '../../../../../src/subscription/application/commands/delete/types/response'

export const name = 'Should delete subscription by course and client'
export const body = async () => {
    const lessonId = 'e3fc36c4-6b09-4aee-8d6c-73cdcc371052'
    const lessonId2 = '94aab239-59d3-4346-b74f-dd7b66179243'
    const course = createCourse({
        lessons: [lessonId],
    })
    const subscription = createSubscription({
        course: course.id.id,
        lessons: [
            {
                lessonId,
                prgress: 30,
                lastTime: 20,
            },
            {
                lessonId: lessonId2,
                prgress: 60,
                lastTime: 25,
            },
        ],
    })
    const subscriptionRepository = new SubscriptionRepositoryMock([
        subscription,
    ])
    const result: Result<DeleteSubscriptionResponse> =
        await new DeleteSubscriptionCommand(
            subscriptionRepository,
            eventPublisherStub,
        ).execute({
            course: course.id.id,
            client: subscription.client.id,
        })
    lookFor(result.isError()).equals(false)
    lookFor(
        await subscriptionRepository.getByCourseAndClient(
            course.id,
            subscription.client,
        ),
    ).toBeUndefined()
}
