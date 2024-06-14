import { createUserWithCode } from './utils/user.factory'
import { UserRepositoryMock } from './utils/user.repository.mock'
import { DateProviderMock } from './utils/date.provider.mock'
import { ValidRecoveryCodeQuery } from '../../../../../src/user/application/queries/valid-recovery/valid.recovery.query'

export const name = 'Should check recovery code'
export const body = async () => {
    const userBase = createUserWithCode({
        email: 'test@mail.com',
    })
    const userRepository = new UserRepositoryMock([userBase])
    const dateToUse = new Date()
    const result = await new ValidRecoveryCodeQuery(
        userRepository,
        new DateProviderMock(dateToUse),
    ).execute({
        email: 'test@mail.com',
        code: '1000',
    })
    lookFor(result.unwrap()).equals(true)
}
