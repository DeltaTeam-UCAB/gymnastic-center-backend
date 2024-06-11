import { ValueObject } from 'src/core/domain/value-objects/value.object'
import { regExpUUID } from 'src/utils/regexps/uuid'
import { unvalidWhoDislikedId } from '../exceptions/unvalid.who-disliked.id'

export class WhoDislikedID implements ValueObject<WhoDislikedID> {
    constructor(private _id: string) {
        if (!regExpUUID.test(_id)) throw unvalidWhoDislikedId()
    }
    get id() {
        return this._id
    }
    equals(other?: WhoDislikedID | undefined): boolean {
        return other?.id === this.id
    }
}
