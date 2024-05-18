import { ApplicationService } from 'src/core/application/service/application.service'
import { ChangePasswordDTO } from './types/dto'
import { ChangePasswordResponse } from './types/response'
import { Result } from 'src/core/application/result-handler/result.handler'
import { UserRepository } from '../../repositories/user.repository'
import { DateProvider } from 'src/core/application/date/date.provider'
import { Crypto } from 'src/core/application/crypto/crypto'
import { invalidCredentialsError } from '../../errors/invalid.credentials'
import { userNotFoundError } from '../../errors/user.not.found'

export class ChangePasswordCommand
    implements ApplicationService<ChangePasswordDTO, ChangePasswordResponse>
{
    constructor(
        private userRepository: UserRepository,
        private dateProvider: DateProvider,
        private crypto: Crypto,
    ) {}
    async execute(
        data: ChangePasswordDTO,
    ): Promise<Result<ChangePasswordResponse>> {
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
        user.password = await this.crypto.encrypt(data.password)
        user.code = undefined
        user.recoveryTime = undefined
        const saveResult = await this.userRepository.save(user)
        if (saveResult.isError()) return saveResult.convertToOther()
        return Result.success({
            id: user.id,
        })
    }
}
