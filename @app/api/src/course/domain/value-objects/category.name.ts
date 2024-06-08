import { ValueObject } from 'src/core/domain/value-objects/value.object'
import { unvalidCategoryName } from '../exceptions/unvalid.category.name'

export class CategoryName implements ValueObject<CategoryName> {
    constructor(private _name: string) {
        if (_name.length < 4) throw unvalidCategoryName()
    }

    get name() {
        return this._name
    }

    equals(other?: CategoryName | undefined): boolean {
        return other?.name === this.name
    }
}
