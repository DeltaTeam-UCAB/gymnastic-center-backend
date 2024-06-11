import { ValueObject } from 'src/core/domain/value-objects/value.object'
import { regExpUUID } from 'src/utils/regexps/uuid'
import { unvalidSubscriptionId } from '../exceptions/unvalid.subscription.id'

export class SubscriptionID implements ValueObject<SubscriptionID> {
    constructor(private _id: string) {
        if (!regExpUUID.test(_id)) throw unvalidSubscriptionId()
    }
    get id() {
        return this._id
    }
    equals(other?: SubscriptionID | undefined): boolean {
        return other?.id === this.id
    }
}
