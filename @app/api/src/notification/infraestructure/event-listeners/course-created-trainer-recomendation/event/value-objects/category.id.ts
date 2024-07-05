import { ValueObject } from 'src/core/domain/value-objects/value.object'
import { regExpUUID } from 'src/utils/regexps/uuid'
import { unvalidCategoryId } from '../exceptions/unvalid.category.id'

export class CategoryID implements ValueObject<CategoryID> {
    constructor(private _id: string) {
        if (!regExpUUID.test(this.id)) throw unvalidCategoryId()
    }
    get id() {
        return this._id
    }
    equals(other?: CategoryID | undefined): boolean {
        return other?.id === this.id
    }
}
