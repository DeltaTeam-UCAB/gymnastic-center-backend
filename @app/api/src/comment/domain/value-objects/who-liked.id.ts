import { ValueObject } from 'src/core/domain/value-objects/value.object'
import { regExpUUID } from 'src/utils/regexps/uuid'
import { unvalidWhoLikedId } from '../exceptions/unvalid.who-liked.id'

export class WhoLikedID implements ValueObject<WhoLikedID> {
    constructor(private _id: string) {
        if (!regExpUUID.test(_id)) throw unvalidWhoLikedId()
    }
    get id() {
        return this._id
    }
    equals(other?: WhoLikedID | undefined): boolean {
        return other?.id === this.id
    }
}
