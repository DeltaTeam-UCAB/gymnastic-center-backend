import { Optional } from '@mono/types-utils'
import { User } from '../../../../../../src/comment/application/models/user'
import { UserRepository } from '../../../../../../src/comment/application/repositories/user.repository'

export class UserRepositoryMock implements UserRepository {
    constructor(private categories: User[] = []) {}

    async getById(id: string): Promise<Optional<User>> {
        return this.categories.find((c) => c.id === id)
    }
}
