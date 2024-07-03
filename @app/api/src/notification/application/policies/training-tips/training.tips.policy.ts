import { Result } from 'src/core/application/result-handler/result.handler'
import { ApplicationService } from 'src/core/application/service/application.service'
import { CreateNotificationDTO } from '../../commands/create/types/dto'
import { CreateNotificationResponse } from '../../commands/create/types/response'
import { ClientRepository } from '../../repositories/client.repository'
import { Tip } from './types/tip'

export class ComunicateTipPolicy implements ApplicationService<void, void> {
    constructor(
        private notificationService: ApplicationService<
            CreateNotificationDTO,
            CreateNotificationResponse
        >,
        private clientRepository: ClientRepository,
        private tip: Tip,
    ) {}
    async execute(): Promise<Result<void>> {
        await this.clientRepository.getAll().each((client) =>
            this.notificationService.execute({
                client: client.id,
                ...this.tip,
                title: 'Tip of the day: ' + this.tip.title,
            }),
        )
        return Result.success(undefined)
    }
}
