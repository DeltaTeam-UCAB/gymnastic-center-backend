import { ApplicationService } from 'src/core/application/service/application.service'
import { ValidRecoveryCodeDTO } from './types/dto'
import { Result } from 'src/core/application/result-handler/result.handler'
import { UserRepository } from '../../repositories/user.repository'
import { DateProvider } from 'src/core/application/date/date.provider'
import { userNotFoundError } from '../../errors/user.not.found'
import { invalidCredentialsError } from '../../errors/invalid.credentials'

export class ValidRecoveryCodeQuery
implements ApplicationService<ValidRecoveryCodeDTO, boolean>
{
    constructor(
        private userRepository: UserRepository,
        private dateProvider: DateProvider,
    ) {}
    async execute(data: ValidRecoveryCodeDTO): Promise<Result<boolean>> {
        const user = await this.userRepository.getByEmail(data.email)
        if (!user) return Result.error(userNotFoundError())
        if (!user.code || !user.recoveryTime)
            return Result.error(invalidCredentialsError())
        if (
            this.dateProvider.getMinutesOfDifference(
                this.dateProvider.current,
                user.recoveryTime,
            ) > 15 ||
            user.code !== data.code
        )
            return Result.error(invalidCredentialsError())
        return Result.success(true)
    }
}
