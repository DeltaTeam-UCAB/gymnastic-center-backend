import { ApplicationService } from 'src/core/application/service/application.service'
import { MarkNotificationAsReadedDTO } from './types/dto'
import { MarkNotificationAsReadedResponse } from './types/response'
import { Result } from 'src/core/application/result-handler/result.handler'
import { NotificationRepository } from '../../repositories/notification.repository'
import { isNotNull } from 'src/utils/null-manager/null-checker'
import { notificationNotFoundError } from '../../erros/notification.not.found'

export class MarkNotificationAsReadedCommand
    implements
        ApplicationService<
            MarkNotificationAsReadedDTO,
            MarkNotificationAsReadedResponse
        >
{
    constructor(private notificationRepository: NotificationRepository) {}
    async execute(
        data: MarkNotificationAsReadedDTO,
    ): Promise<Result<MarkNotificationAsReadedResponse>> {
        const notification = await this.notificationRepository.getById(data.id)
        if (!isNotNull(notification) || notification.client !== data.client)
            return Result.error(notificationNotFoundError())
        notification.readed = true
        const saveResult = await this.notificationRepository.save(notification)
        if (saveResult.isError()) return saveResult.convertToOther()
        return Result.success({
            id: notification.id,
        })
    }
}
