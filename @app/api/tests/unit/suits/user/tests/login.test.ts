import { LoginCommand } from '../../../../../src/user/application/commads/login/login.command'
import { CryptoMock } from './utils/crypto.mock'
import { UserRepositoryMock } from './utils/user.repository.mock'
import { TokenProviderMock } from './utils/token.provider.mock'
import { LoginDTO } from '../../../../../src/user/application/commads/login/types/dto'
import { createUser } from './utils/user.factory'

export const name = 'Should login with correct credentials'
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
    lookFor(res.token).toBeTruthy()
}
