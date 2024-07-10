import { Client } from '../../../../../../src/comment/domain/entities/client'
import { ClientID } from '../../../../../../src/comment/domain/value-objects/client.id'
import { ClientName } from '../../../../../../src/comment/domain/value-objects/client.name'

export const createUser = (data?: { id?: string; name?: string }): Client =>
    new Client(
        new ClientID(data?.id ?? 'ac674f85-ba0d-4a24-bbf4-c003d658ca13'),
        {
            name: new ClientName(data?.name ?? 'test name'),
        },
    )
