import { ApplicationService } from 'src/core/application/service/application.service'
import { RecoveryPasswordDTO } from '../types/dto'
import { UserRepository } from 'src/user/application/repositories/user.repository'
import { UserSender } from 'src/user/application/services/sender'
import { Result } from 'src/core/application/result-handler/result.handler'

export class RecoveryPasswordSenderDecorator
implements ApplicationService<RecoveryPasswordDTO, void>
{
    constructor(
        private service: ApplicationService<RecoveryPasswordDTO, void>,
        private userRepository: UserRepository,
        private sender: UserSender,
    ) {}
    async execute(data: RecoveryPasswordDTO): Promise<Result<void>> {
        const result = await this.service.execute(data)
        if (result.isError()) return result
        const user = await this.userRepository.getByEmail(data.email)
        if (!user) return result
        const sendResult = await this.sender.sendToUser(user)
        if (sendResult.isError()) return sendResult.convertToOther()
        return result
    }
}
