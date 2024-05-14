import { Result } from '../../../../../src/core/application/result-handler/result.handler'
import { UpdateUserResponse } from '../../../../../src/user/application/commads/update/types/response'
import { UpdateUserCommand } from '../../../../../src/user/application/commads/update/update.user.command'
import { INVALID_CREDENTIALS } from '../../../../../src/user/application/errors/invalid.credentials'
import { CryptoMock } from './utils/crypto.mock'
import { UserRepositoryMock } from './utils/user.repository.mock'

export const name = 'Should not update user without unique email'
export const body = async () => {
    const userId = '11111111'
    const userRepo = new UserRepositoryMock([
        {
            id: userId,
            name: 'test user',
            email: 'test@mail.com',
            type: 'CLIENT',
            password: '123',
            phone: '1111111',
            verified: true,
        },
        {
            id: '123456789',
            name: 'test user 1',
            email: 'test1@mail.com',
            type: 'CLIENT',
            password: '123',
            phone: '1111111',
            verified: true,
        },
    ])
    const result: Result<UpdateUserResponse> = await new UpdateUserCommand(
        new CryptoMock(),
        userRepo,
    ).execute({
        id: userId,
        email: 'test1@mail.com',
    })
    result.handleError((e) => {
        lookFor(e.name).equals(INVALID_CREDENTIALS)
    })
}
