import { Result } from 'src/core/application/result-handler/result.handler'
import { User } from '../models/user'
import { Optional } from '@mono/types-utils'

export interface UserRepository {
    save(user: User): Promise<Result<User>>
    getById(id: string): Promise<Optional<User>>
    getByEmail(email: string): Promise<Optional<User>>
    existByEmail(email: string): Promise<boolean>
}
