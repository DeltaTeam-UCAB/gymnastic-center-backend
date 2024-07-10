import { Result } from 'src/core/application/result-handler/result.handler'
import { ApplicationService } from 'src/core/application/service/application.service'
import { CreateNotificationDTO } from '../../commands/create/types/dto'
import { CreateNotificationResponse } from '../../commands/create/types/response'
import { ClientRepository } from '../../repositories/client.repository'

export class LetsTrainPolicy implements ApplicationService<void, void> {
    constructor(
        private notificationService: ApplicationService<
            CreateNotificationDTO,
            CreateNotificationResponse
        >,
        private clientRepository: ClientRepository,
    ) {}
    async execute(): Promise<Result<void>> {
        await this.clientRepository.getAll().each((client) =>
            this.notificationService.execute({
                client: client.id,
                body: `${client.name} let's train!!! 💪💪💪`,
                title: 'Training reminder',
            }),
        )
        return Result.success(undefined)
    }
}
