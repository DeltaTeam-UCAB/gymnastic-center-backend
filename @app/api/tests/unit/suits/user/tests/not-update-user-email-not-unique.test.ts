import { Result } from '../../../../../src/core/application/result-handler/result.handler'
import { UpdateUserResponse } from '../../../../../src/user/application/commads/update/types/response'
import { UpdateUserCommand } from '../../../../../src/user/application/commads/update/update.user.command'
import { INVALID_CREDENTIALS } from '../../../../../src/user/application/errors/invalid.credentials'
import { CryptoMock } from './utils/crypto.mock'
import { createUser } from './utils/user.factory'
import { UserRepositoryMock } from './utils/user.repository.mock'

export const name = 'Should not update user without unique email'
export const body = async () => {
    const userId = '11111111'
    const userRepo = new UserRepositoryMock([
        createUser({
            id: userId,
            email: 'test@mail.com',
        }),
        createUser({
            id: '123456789',
            email: 'test1@mail.com',
        }),
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
