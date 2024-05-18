import { ApplicationService } from 'src/core/application/service/application.service'
import { RecoveryPasswordDTO } from './types/dto'
import { Result } from 'src/core/application/result-handler/result.handler'
import { UserRepository } from '../../repositories/user.repository'
import { RandomCodeGenerator } from 'src/core/application/random-code/random-code.generator'
import { userNotFoundError } from '../../errors/user.not.found'
import { DateProvider } from 'src/core/application/date/date.provider'

export class RecoveryPasswordCommand
implements ApplicationService<RecoveryPasswordDTO, void>
{
    constructor(
        private userRepository: UserRepository,
        private randomCodeGenerator: RandomCodeGenerator,
        private dateProvider: DateProvider,
    ) {}
    async execute(data: RecoveryPasswordDTO): Promise<Result<void>> {
        const user = await this.userRepository.getByEmail(data.email)
        if (!user) return Result.error(userNotFoundError())
        user.code = this.randomCodeGenerator.generate(4)
        user.recoveryTime = this.dateProvider.current
        const saveResult = await this.userRepository.save(user)
        if (saveResult.isError()) return saveResult.convertToOther()
        return Result.success(undefined)
    }
}
