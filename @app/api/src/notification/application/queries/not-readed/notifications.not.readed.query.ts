import { ApplicationService } from 'src/core/application/service/application.service'
import { GetCountNotificationsNotReadedDTO } from './types/dto'
import { GetCountNotificationsNotReadedResponse } from './types/response'
import { Result } from 'src/core/application/result-handler/result.handler'
import { NotificationRepository } from '../../repositories/notification.repository'

export class GetCountNotificationsNotReadedQuery
    implements
        ApplicationService<
            GetCountNotificationsNotReadedDTO,
            GetCountNotificationsNotReadedResponse
        >
{
    constructor(private notificationRepository: NotificationRepository) {}
    async execute(
        data: GetCountNotificationsNotReadedDTO,
    ): Promise<Result<GetCountNotificationsNotReadedResponse>> {
        const count = await this.notificationRepository.countNotReaded(
            data.client,
        )
        return Result.success({
            count,
        })
    }
}
