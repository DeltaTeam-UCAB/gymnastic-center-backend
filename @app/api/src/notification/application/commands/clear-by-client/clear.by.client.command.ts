import { Result } from 'src/core/application/result-handler/result.handler'
import { ApplicationService } from 'src/core/application/service/application.service'
import { NotificationRepository } from '../../repositories/notification.repository'

export class ClearClientNotificationsCommand
    implements ApplicationService<string, void>
{
    constructor(private notificationRepository: NotificationRepository) {}
    async execute(data: string): Promise<Result<void>> {
        const result = await this.notificationRepository.deleteByUser(data)
        if (result.isError()) return result.convertToOther()
        return Result.success(undefined)
    }
}
