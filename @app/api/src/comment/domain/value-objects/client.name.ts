import { ValueObject } from 'src/core/domain/value-objects/value.object'
import { unvalidClientName } from '../exceptions/unvalid.client.name'

export class ClientName implements ValueObject<ClientName> {
    constructor(private _name: string) {
        if (_name.length < 7) throw unvalidClientName()
    }
    get name() {
        return this._name
    }
    equals(other?: ClientName | undefined): boolean {
        return other?.name === this.name
    }
}
