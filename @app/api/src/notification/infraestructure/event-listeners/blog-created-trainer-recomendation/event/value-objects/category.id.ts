import { ValueObject } from 'src/core/domain/value-objects/value.object'
import { regExpUUID } from 'src/utils/regexps/uuid'
import { unvalidCategoryId } from '../exceptions/unvalid.category.id'

export class CategoryId implements ValueObject<CategoryId> {
    constructor(private _id: string) {
        if (!regExpUUID.test(_id)) throw unvalidCategoryId()
    }
    get id() {
        return this._id
    }
    equals(other?: CategoryId | undefined): boolean {
        return other?.id === this.id
    }
}
