import { ValueObject } from 'src/core/domain/value-objects/value.object'
import { regExpUUID } from 'src/utils/regexps/uuid'
import { unvalidClientId } from '../exceptions/unvalid.client.id'

export class ClientID implements ValueObject<ClientID> {
    constructor(private _id: string) {
        if (!regExpUUID.test(_id)) throw unvalidClientId()
    }

    get id() {
        return this._id
    }

    equals(other?: ClientID | undefined): boolean {
        return other?.id === this.id
    }
}
