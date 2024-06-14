import { Entity } from 'src/core/domain/entity/entity'
import { ClientID } from '../value-objects/client.id'
import { ClientName } from '../value-objects/client.name'

export class Client extends Entity<ClientID> {
    constructor(
        id: ClientID,
        private data: {
            name: ClientName
        },
    ) {
        super(id)
    }

    get name() {
        return this.data.name
    }
}
