import { LoginCommand } from '../../../../../src/user/application/commads/login/login.command'
import { CryptoMock } from './utils/crypto.mock'
import { UserRepositoryMock } from './utils/user.repository.mock'
import { TokenProviderMock } from './utils/token.provider.mock'
import { LoginDTO } from '../../../../../src/user/application/commads/login/types/dto'
import { Result } from '../../../../../src/core/application/result-handler/result.handler'
import { LoginResponse } from '../../../../../src/user/application/commads/login/types/response'
import { WRONG_CREDENTIALS } from '../../../../../src/user/application/errors/wrong.credentials'

export const name = 'Should not login without correct email'
export const body = async () => {
    const userRepo = new UserRepositoryMock()
    const userBaseData = {
        email: 'test@mail.com',
        password: '123',
    } satisfies LoginDTO
    const result: Result<LoginResponse> = await new LoginCommand(
        userRepo,
        new CryptoMock(),
        new TokenProviderMock(),
    ).execute(userBaseData)
    result.handleError((e) => {
        lookFor(e.name).equals(WRONG_CREDENTIALS)
    })
}
