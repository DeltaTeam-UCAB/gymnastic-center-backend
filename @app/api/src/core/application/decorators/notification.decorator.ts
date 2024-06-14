import { ApplicationService } from '../service/application.service'
import { Result } from '../result-handler/result.handler'
import { NotificationHandler } from '../notifications/notification.handler'

export class NotificationDecorator<T, U> implements ApplicationService<T, U> {
    constructor(
        private service: ApplicationService<T, U>,
        private notificationHandlers: NotificationHandler<T, U>[],
    ) {}

    async execute(data: T): Promise<Result<U>> {
        const result = await this.service.execute(data)
        this.notificationHandlers.forEach((e) => e.publish(data, result))
        return result
    }
}
