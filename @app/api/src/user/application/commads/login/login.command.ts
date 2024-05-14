import { ApplicationService } from 'src/core/application/service/application.service'
import { LoginDTO } from './types/dto'
import { LoginResponse } from './types/response'
import { Result } from 'src/core/application/result-handler/result.handler'
import { UserRepository } from '../../repositories/user.repository'
import { Crypto } from 'src/core/application/crypto/crypto'
import { TokenProvider } from 'src/core/application/token/token.provider'
import { TokenPayload } from './types/token.payload'
import { isNotNull } from 'src/utils/null-manager/null-checker'
import { wrongCredentialsError } from '../../errors/wrong.credentials'

export class LoginCommand
implements ApplicationService<LoginDTO, LoginResponse>
{
    constructor(
        private userRepository: UserRepository,
        private crypto: Crypto,
        private tokenProvider: TokenProvider<TokenPayload>,
    ) {}

    async execute(data: LoginDTO): Promise<Result<LoginResponse>> {
        const user = await this.userRepository.getByEmail(data.email)
        if (!isNotNull(user)) return Result.error(wrongCredentialsError())
        if (!(await this.crypto.compare(data.password, user.password)))
            return Result.error(wrongCredentialsError())
        const tokenResult = this.tokenProvider.sign({
            id: user.id,
        })
        if (tokenResult.isError()) return tokenResult.convertToOther()
        return Result.success({
            token: tokenResult.unwrap(),
            type: user.type,
        })
    }
}
