import { ApplicationService } from 'src/core/application/service/application.service'
import { GetNotificationByIdDTO } from './types/dto'
import { GetNotificationByIdResponse } from './types/response'
import { Result } from 'src/core/application/result-handler/result.handler'
import { NotificationRepository } from '../../repositories/notification.repository'
import { notificationNotFoundError } from '../../erros/notification.not.found'

export class GetNotificationByIdQuery
implements
        ApplicationService<GetNotificationByIdDTO, GetNotificationByIdResponse>
{
    constructor(private notificationRepository: NotificationRepository) {}
    async execute(
        data: GetNotificationByIdDTO,
    ): Promise<Result<GetNotificationByIdResponse>> {
        const notification = await this.notificationRepository.getById(data.id)
        if (!notification) return Result.error(notificationNotFoundError())
        return Result.success({
            id: notification.id,
            title: notification.title,
            body: notification.body,
            date: notification.date,
        })
    }
}
