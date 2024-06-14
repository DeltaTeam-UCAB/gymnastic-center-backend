import { ApplicationService } from 'src/core/application/service/application.service'
import { CurrentUserDTO } from './types/dto'
import { CurrentUserResponse } from './types/response'
import { Result } from 'src/core/application/result-handler/result.handler'
import { UserRepository } from '../../repositories/user.repository'
import { TokenProvider } from 'src/core/application/token/token.provider'
import { TokenPayload } from '../../commads/login/types/token.payload'
import { isNotNull } from 'src/utils/null-manager/null-checker'
import { userNotFoundError } from '../../errors/user.not.found'

export class CurrentUserQuery
    implements ApplicationService<CurrentUserDTO, CurrentUserResponse>
{
    constructor(
        private userRepository: UserRepository,
        private tokenProvider: TokenProvider<TokenPayload>,
    ) {}
    async execute(data: CurrentUserDTO): Promise<Result<CurrentUserResponse>> {
        const resultToken = this.tokenProvider.verify(data.token)
        if (resultToken.isError()) return resultToken.convertToOther()
        const payload = resultToken.unwrap()
        const user = await this.userRepository.getById(payload.id)
        if (!isNotNull(user)) return Result.error(userNotFoundError())
        return Result.success({
            id: user.id,
            email: user.email,
            name: user.name,
            phone: user.phone,
            type: user.type,
            image: user.image,
        })
    }
}
