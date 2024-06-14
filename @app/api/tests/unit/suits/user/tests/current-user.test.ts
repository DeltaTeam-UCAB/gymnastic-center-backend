import { LoginCommand } from '../../../../../src/user/application/commads/login/login.command'
import { CurrentUserQuery } from '../../../../../src/user/application/queries/current/current.query'
import { CryptoMock } from './utils/crypto.mock'
import { UserRepositoryMock } from './utils/user.repository.mock'
import { TokenProviderMock } from './utils/token.provider.mock'
import { LoginDTO } from '../../../../../src/user/application/commads/login/types/dto'
import { Result } from '../../../../../src/core/application/result-handler/result.handler'
import { CurrentUserResponse } from '../../../../../src/user/application/queries/current/types/response'
import { createUser } from './utils/user.factory'

export const name = 'Should get current user after login'
export const body = async () => {
    const userRepo = new UserRepositoryMock([
        createUser({
            id: '11111111',
            name: 'test user exist',
            email: 'test@mail.com',
            type: 'CLIENT',
            password: '123',
        }),
    ])
    const userBaseData = {
        email: 'test@mail.com',
        password: '123',
    } satisfies LoginDTO
    const result = await new LoginCommand(
        userRepo,
        new CryptoMock(),
        new TokenProviderMock(),
    ).execute(userBaseData)
    const res = result.unwrap()
    const currentResult: Result<CurrentUserResponse> =
        await new CurrentUserQuery(userRepo, new TokenProviderMock()).execute({
            token: res.token,
        })
    lookFor(currentResult.unwrap()).toDeepEqual({
        id: '11111111',
        name: 'test user exist',
        email: 'test@mail.com',
        type: 'CLIENT',
        phone: '111111111',
        image: undefined,
    })
}
