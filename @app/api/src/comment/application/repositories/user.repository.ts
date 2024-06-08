import { Optional } from '@mono/types-utils'
import { User } from '../models/user'

export interface UserRepository {
    getById(id: string): Promise<Optional<User>>
}
