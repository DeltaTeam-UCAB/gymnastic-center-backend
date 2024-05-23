import { ApplicationService } from 'src/core/application/service/application.service'
import { CreateNotificationDTO } from './types/dto'
import { CreateNotificationResponse } from './types/response'
import { Result } from 'src/core/application/result-handler/result.handler'
import { IDGenerator } from 'src/core/application/ID/ID.generator'
import { NotificationRepository } from '../../repositories/notification.repository'
import { DateProvider } from 'src/core/application/date/date.provider'
import { Notification } from '../../models/notification'

export class CreateNotificationCommand
    implements
        ApplicationService<CreateNotificationDTO, CreateNotificationResponse>
{
    constructor(
        private idGenerator: IDGenerator<string>,
        private notificationRepository: NotificationRepository,
        private dateProvider: DateProvider,
    ) {}
    async execute(
        data: CreateNotificationDTO,
    ): Promise<Result<CreateNotificationResponse>> {
        const id = this.idGenerator.generate()
        const notification = {
            id,
            ...data,
            date: this.dateProvider.current,
            readed: false,
        } satisfies Notification
        const saveResult = await this.notificationRepository.save(notification)
        if (saveResult.isError()) return saveResult.convertToOther()
        return Result.success({
            id,
        })
    }
}
