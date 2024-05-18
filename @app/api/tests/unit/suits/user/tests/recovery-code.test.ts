import { createUser } from './utils/user.factory'
import { UserRepositoryMock } from './utils/user.repository.mock'
import { RecoveryPasswordCommand } from '../../../../../src/user/application/commads/recovery-password/recovery.password.command'
import { RandomCodeMock } from './utils/random.code.mock'
import { DateProviderMock } from './utils/date.provider.mock'

export const name = 'Should set recovery code to user'
export const body = async () => {
    const userBase = createUser({
        email: 'test@mail.com',
    })
    const userRepository = new UserRepositoryMock([userBase])
    const dateToUse = new Date()
    const result = await new RecoveryPasswordCommand(
        userRepository,
        new RandomCodeMock(),
        new DateProviderMock(dateToUse),
    ).execute({
        email: 'test@mail.com',
    })
    lookFor(result.isError()).equals(false)
    lookFor(await userRepository.getByEmail('test@mail.com')).toDeepEqual({
        ...userBase,
        code: '1000',
        recoveryTime: dateToUse,
    })
}
