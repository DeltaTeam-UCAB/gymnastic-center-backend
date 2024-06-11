import { createCourse } from './utils/course.factory'
import { CourseRepositoryMock } from './utils/course.repository.mock'
import { CreateSubscriptionCommand } from '../../../../../src/subscription/application/commands/create/create.subscription'
import { SubscriptionRepositoryMock } from './utils/subscription.repository.mock'
import { IDGeneratorMock } from './utils/id.generator.mock'
import { ClientID } from '../../../../../src/subscription/domain/value-objects/client.id'
import { DateProviderMock } from './utils/date.provider.mock'

export const name = 'Should create a subscription'
export const body = async () => {
    const lessonId = 'e3fc36c4-6b09-4aee-8d6c-73cdcc371052'
    const course = createCourse({
        lessons: [lessonId],
    })
    const courseRepository = new CourseRepositoryMock([course])
    const subscriptionRepository = new SubscriptionRepositoryMock()
    const clientId = '718bdd1f-48f0-4a01-9842-5bbb067a0616'
    const result = await new CreateSubscriptionCommand(
        new IDGeneratorMock(),
        subscriptionRepository,
        courseRepository,
        new DateProviderMock(),
    ).execute({
        client: clientId,
        course: course.id.id,
    })
    lookFor(result.isError()).equals(false)
    const subscription = await subscriptionRepository.getByCourseAndClient(
        course.id,
        new ClientID(clientId),
    )
    lookFor(subscription).toBeDefined()
    lookFor(subscription?.lessons.length).equals(1)
    subscription?.lessons.forEach((e) => {
        lookFor(e.id.id).equals(lessonId)
        lookFor(e.progress.percent).equals(0)
        lookFor(e.lastTime).toBeUndefined()
    })
}
