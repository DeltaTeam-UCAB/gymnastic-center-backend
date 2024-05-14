import { ApplicationService } from 'src/core/application/service/application.service'
import { CreateUserDTO } from './types/dto'
import { CreateUserResponse } from './types/response'
import { Result } from 'src/core/application/result-handler/result.handler'
import { IDGenerator } from 'src/core/application/ID/ID.generator'
import { Crypto } from 'src/core/application/crypto/crypto'
import { RandomCodeGenerator } from 'src/core/application/random-code/random-code.generator'
import { UserRepository } from '../../repositories/user.repository'
import { User } from '../../models/user'
import { invalidCredentialsError } from '../../errors/invalid.credentials'

export class CreateUserCommand
implements ApplicationService<CreateUserDTO, CreateUserResponse>
{
    constructor(
        private idGenerator: IDGenerator<string>,
        private crypto: Crypto,
        private userRepository: UserRepository,
        private randomCodeGen: RandomCodeGenerator,
    ) {}
    async execute(data: CreateUserDTO): Promise<Result<CreateUserResponse>> {
        const isUserExist = await this.userRepository.existByEmail(data.email)
        if (isUserExist) return Result.error(invalidCredentialsError())
        const userId = this.idGenerator.generate()
        const user = {
            ...data,
            id: userId,
            password: await this.crypto.encrypt(data.password),
            code: this.randomCodeGen.generate(6),
            verified: true,
        } satisfies User
        const result = await this.userRepository.save(user)
        if (result.isError()) return result.convertToOther()
        return Result.success({
            id: userId,
        })
    }
}
