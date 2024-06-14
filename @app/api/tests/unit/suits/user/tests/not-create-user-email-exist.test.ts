import { Result } from '../../../../../src/core/application/result-handler/result.handler'
import { CreateUserDTO } from '../../../../../src/user/application/commads/create/types/dto'
import { CreateUserCommand } from '../../../../../src/user/application/commads/create/create.user.command'
import { IDGeneratorMock } from './utils/id.generator.mock'
import { CryptoMock } from './utils/crypto.mock'
import { UserRepositoryMock } from './utils/user.repository.mock'
import { CreateUserResponse } from '../../../../../src/user/application/commads/create/types/response'
import { INVALID_CREDENTIALS } from '../../../../../src/user/application/errors/invalid.credentials'
import { createUser } from './utils/user.factory'

export const name = 'Should not create user with an existing email'
export const body = async () => {
    const userBaseData = {
        name: 'test user',
        email: 'test@mail.com',
        password: '123',
        type: 'CLIENT',
        phone: '1111111',
    } satisfies CreateUserDTO
    const userRepo = new UserRepositoryMock([
        createUser({
            email: 'test@mail.com',
        }),
    ])
    const result: Result<CreateUserResponse> = await new CreateUserCommand(
        new IDGeneratorMock(),
        new CryptoMock(),
        userRepo,
    ).execute(userBaseData)
    result.handleError((e) => {
        lookFor(e.name).equals(INVALID_CREDENTIALS)
    })
}
