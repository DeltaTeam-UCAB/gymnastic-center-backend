import { ApplicationService } from 'src/core/application/service/application.service'
import { CreateNotificationDTO } from '../types/dto'
import { CreateNotificationResponse } from '../types/response'
import { Result } from 'src/core/application/result-handler/result.handler'
import { NotificationManager } from 'src/notification/application/services/notification.manager'

export class NotificationDecorator
implements
        ApplicationService<CreateNotificationDTO, CreateNotificationResponse>
{
    constructor(
        private service: ApplicationService<
            CreateNotificationDTO,
            CreateNotificationResponse
        >,
        private notificationManager: NotificationManager,
    ) {}
    async execute(
        data: CreateNotificationDTO,
    ): Promise<Result<CreateNotificationResponse>> {
        const resp = await this.service.execute(data)
        if (resp.isError()) return resp
        await this.notificationManager.notify({
            body: data.body,
            title: data.title,
            to: data.client,
        })
        return resp
    }
}
