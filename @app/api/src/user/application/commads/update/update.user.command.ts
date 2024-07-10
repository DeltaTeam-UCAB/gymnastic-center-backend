import { ApplicationService } from 'src/core/application/service/application.service'
import { Result } from 'src/core/application/result-handler/result.handler'
import { Crypto } from 'src/core/application/crypto/crypto'
import { UserRepository } from '../../repositories/user.repository'
import { invalidCredentialsError } from '../../errors/invalid.credentials'
import { UpdateUserDTO } from './types/dto'
import { UpdateUserResponse } from './types/response'
import { isNotNull } from 'src/utils/null-manager/null-checker'
import { userNotFoundError } from '../../errors/user.not.found'

export class UpdateUserCommand
    implements ApplicationService<UpdateUserDTO, UpdateUserResponse>
{
    constructor(
        private crypto: Crypto,
        private userRepository: UserRepository,
    ) {}

    async execute(data: UpdateUserDTO): Promise<Result<UpdateUserResponse>> {
        const user = await this.userRepository.getById(data.id)
        if (!isNotNull(user)) return Result.error(userNotFoundError())
        if (data.email && data.email !== user.email) {
            const isEmailExist = await this.userRepository.existByEmail(
                data.email,
            )
            if (isEmailExist) return Result.error(invalidCredentialsError())
        }
        Object.keys(data).forEach((e) => {
            if (e === 'id' || (!data[e] && e !== 'image')) return
            user[e] = data[e]
        })
        if (data.password)
            user.password = await this.crypto.encrypt(user.password)
        const result = await this.userRepository.save(user)
        if (result.isError()) return result.convertToOther()
        return Result.success({
            id: user.id,
        })
    }
}
