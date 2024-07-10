import { User } from './user'
import { Optional } from '@mono/types-utils'

export interface UserRepository {
    getById(id: string): Promise<Optional<User>>
}
