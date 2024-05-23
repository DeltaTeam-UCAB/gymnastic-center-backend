import { ApplicationService } from 'src/core/application/service/application.service'
import { GetNotificationsManyDTO } from './types/dto'
import { GetNotificationsManyResponse } from './types/response'
import { Result } from 'src/core/application/result-handler/result.handler'
import { NotificationRepository } from '../../repositories/notification.repository'

export class GetNotificationsManyQuery
    implements
        ApplicationService<
            GetNotificationsManyDTO,
            GetNotificationsManyResponse
        >
{
    constructor(private notificationRepository: NotificationRepository) {}
    async execute(
        data: GetNotificationsManyDTO,
    ): Promise<Result<GetNotificationsManyResponse>> {
        const notifications = await this.notificationRepository.getMany(data)
        return Result.success(
            notifications.map((e) => ({
                id: e.id,
                title: e.title,
                body: e.body,
                readed: e.readed,
                date: e.date,
            })),
        )
    }
}
