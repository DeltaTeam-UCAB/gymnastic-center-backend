import { Optional } from '@mono/types-utils'
import { User } from '../../../../../../src/user/application/models/user'
import { UserRepository } from '../../../../../../src/user/application/repositories/user.repository'
import { Result } from '../../../../../../src/core/application/result-handler/result.handler'

export class UserRepositoryMock implements UserRepository {
    constructor(private users: User[] = []) {}

    async save(user: User): Promise<Result<User>> {
        this.users = this.users.filter((e) => e.id !== user.id)
        this.users.push(user)
        return Result.success(user)
    }

    async getByEmail(email: string): Promise<Optional<User>> {
        return this.users.find((e) => e.email === email)
    }

    async getById(id: string): Promise<Optional<User>> {
        return this.users.find((e) => e.id === id)
    }

    async existByEmail(email: string): Promise<boolean> {
        return this.users.some((e) => e.email === email)
    }
}
