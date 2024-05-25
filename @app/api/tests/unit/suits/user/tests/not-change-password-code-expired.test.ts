import { createUserWithCode } from './utils/user.factory'
import { UserRepositoryMock } from './utils/user.repository.mock'
import { DateProviderMock } from './utils/date.provider.mock'
import { ChangePasswordCommand } from '../../../../../src/user/application/commads/change-password/change.password.command'
import { CryptoMock } from './utils/crypto.mock'

export const name = 'Should not change password recovery code expired'
export const body = async () => {
    const userBase = createUserWithCode({
        email: 'test@mail.com',
        password: '123',
    })
    const userRepository = new UserRepositoryMock([userBase])
    const dateToUse = new Date()
    const result = await new ChangePasswordCommand(
        userRepository,
        new DateProviderMock(dateToUse, 16),
        new CryptoMock(),
    ).execute({
        email: 'test@mail.com',
        code: '1000',
        password: '1234',
    })
    lookFor(result.isError()).equals(true)
}
