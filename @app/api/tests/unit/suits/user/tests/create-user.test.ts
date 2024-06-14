import { CreateUserDTO } from '../../../../../src/user/application/commads/create/types/dto'
import { CreateUserCommand } from '../../../../../src/user/application/commads/create/create.user.command'
import { IDGeneratorMock } from './utils/id.generator.mock'
import { CryptoMock } from './utils/crypto.mock'
import { UserRepositoryMock } from './utils/user.repository.mock'

export const name = 'Should create user with valid data'
export const body = async () => {
    const userId = '1234567890'
    const userBaseData = {
        name: 'test user',
        email: 'test@mail.com',
        password: '123',
        type: 'CLIENT',
        phone: '1111111',
    } satisfies CreateUserDTO
    const userRepo = new UserRepositoryMock()
    await new CreateUserCommand(
        new IDGeneratorMock(userId),
        new CryptoMock(),
        userRepo,
    ).execute(userBaseData)
    lookFor(await userRepo.getById(userId)).toDeepEqual({
        ...userBaseData,
        id: userId,
    })
}
