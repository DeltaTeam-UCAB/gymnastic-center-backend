import { Subscription } from '../../../../../src/course/domain/entities/subscription'
import { ClientID } from '../../../../../src/course/domain/value-objects/client.id'
import { CourseID } from '../../../../../src/course/domain/value-objects/course.id'
import { SubscriptionID } from '../../../../../src/course/domain/value-objects/subscription.id'
import { SubscriptionProgress } from '../../../../../src/course/domain/value-objects/subscription.progress'


export const name = 'Should create subscription entity'
export const body = async () => {
    const subscription = new Subscription(new SubscriptionID('8b1d451d-ab49-42eb-91f6-4949cf0b8574'),
    {
        course: new CourseID('bec294c2-ccdc-4631-b72f-7bc4cf9be4e3'),
        client: new ClientID('b975b949-c909-4bfa-812b-2578c6461b58'),
        progress: new SubscriptionProgress(1),
    })
    lookFor(subscription).toBeDefined()
    
}
