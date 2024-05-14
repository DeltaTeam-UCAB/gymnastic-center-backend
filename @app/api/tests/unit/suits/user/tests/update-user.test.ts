import { UpdateUserCommand } from '../../../../../src/user/application/commads/update/update.user.command'
import { CryptoMock } from './utils/crypto.mock'
import { UserRepositoryMock } from './utils/user.repository.mock'

export const name = 'Should update created user'
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
    ])
    await new UpdateUserCommand(new CryptoMock(), userRepo).execute({
        id: userId,
        name: 'test user updated',
    })
    lookFor(await userRepo.getById(userId)).toDeepEqual({
        id: userId,
        name: 'test user updated',
        email: 'test@mail.com',
        type: 'CLIENT',
        password: '123',
        phone: '1111111',
        verified: true,
    })
}
