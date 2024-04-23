import { Publisher } from '../publisher/notification.publisher'
import { Unsubscribe } from './unsubscribe'
import { ValueObject } from 'src/core/domain/value-objects/value.object'

export interface NotificationHandler<
    T extends object,
    U extends ValueObject<U>,
> {
    subscribe(value: U, callback: Publisher<T>): Promise<Unsubscribe>
    publish(to: U, data: T): Promise<void>
}
