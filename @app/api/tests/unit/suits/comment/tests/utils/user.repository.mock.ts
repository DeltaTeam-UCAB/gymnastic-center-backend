import { Optional } from '@mono/types-utils'
import { UserRepository } from '../../../../../../src/comment/application/repositories/user.repository'
import { ClientID } from '../../../../../../src/comment/domain/value-objects/client.id'
import { Client } from '../../../../../../src/comment/domain/entities/client'

export class UserRepositoryMock implements UserRepository {
    constructor(private users: Client[] = []) {}

    async getById(id: ClientID): Promise<Optional<Client>> {
        return this.users.find((c) => c.id == id)
    }
}
