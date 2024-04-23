import { ApplicationService } from '../service/application.service'
import { NotificationHandler } from '../notifications/handler/notification.handler'
import { Result } from '../result-handler/result.handler'
import { ValueObject } from 'src/core/domain/value-objects/value.object'

export class NotificationDecorator<
    T,
    U,
    D extends object,
    V extends ValueObject<V>,
> implements ApplicationService<T, U>
{
    constructor(
        private service: ApplicationService<T, U>,
        private notificationHandler: NotificationHandler<D, V>,
        private data: {
            to: V
            data: D
        },
    ) {}

    async execute(data: T): Promise<Result<U>> {
        const result = await this.service.execute(data)
        this.notificationHandler.publish(this.data.to, this.data.data)
        return result
    }
}
