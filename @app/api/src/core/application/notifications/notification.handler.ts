import { Result } from '../result-handler/result.handler'

export interface NotificationHandler<T, U> {
    publish(data: T, result: Result<U>): Promise<void>
}
