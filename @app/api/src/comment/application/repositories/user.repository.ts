import { Optional } from '@mono/types-utils'
import { ClientID } from 'src/comment/domain/value-objects/client.id'
import { Client } from 'src/comment/domain/entities/client'

export interface UserRepository {
    getById(id: ClientID): Promise<Optional<Client>>
}
