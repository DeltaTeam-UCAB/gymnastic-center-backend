import { Result } from '../../../../../src/core/application/result-handler/result.handler'
import { CreateUserDTO } from '../../../../../src/user/application/commads/create/types/dto'
import { CreateUserCommand } from '../../../../../src/user/application/commads/create/create.user.command'
import { IDGeneratorMock } from './utils/id.generator.mock'
import { CryptoMock } from './utils/crypto.mock'
import { UserRepositoryMock } from './utils/user.repository.mock'
import { RandomCodeMock } from './utils/random.code.mock'
import { CreateUserResponse } from '../../../../../src/user/application/commads/create/types/response'
import { INVALID_CREDENTIALS } from '../../../../../src/user/application/errors/invalid.credentials'

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
        {
            id: '11111111',
            name: 'test user exist',
            email: 'test@mail.com',
            type: 'CLIENT',
            password: '1234567',
            phone: '1111111',
            verified: true,
        },
    ])
    const result: Result<CreateUserResponse> = await new CreateUserCommand(
        new IDGeneratorMock(),
        new CryptoMock(),
        userRepo,
        new RandomCodeMock(),
    ).execute(userBaseData)
    result.handleError((e) => {
        lookFor(e.name).equals(INVALID_CREDENTIALS)
    })
}
