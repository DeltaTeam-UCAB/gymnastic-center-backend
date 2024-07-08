import { Entity } from 'src/core/domain/entity/entity'
import { ClientID } from '../value-objects/client.id'
import { ClientName } from '../value-objects/client.name'
import { Clonable } from 'src/core/domain/clonable/clonable'

export class Client extends Entity<ClientID> implements Clonable<Client> {
    constructor(
        id: ClientID,
        private data: {
            name: ClientName
        },
    ) {
        super(id)
    }

    clone(): Client {
        return new Client(this.id, {
            ...this.data,
        })
    }

    get name() {
        return this.data.name
    }
}
