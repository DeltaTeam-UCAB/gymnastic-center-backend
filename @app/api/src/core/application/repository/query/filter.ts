import { FieldName } from './field.name'
import { FieldValue } from './field.value'
import { FilterOperator } from './filter.operator'
import { ValueObject } from 'src/core/domain/value-objects/value.object'

export class Filter implements ValueObject<Filter> {
    constructor(
        private _field: FieldName,
        private _value: FieldValue,
        private _operator: FilterOperator,
    ) {
        if (!this.field || !this.value || !this.operator)
            throw new Error('Invalid filter')
    }

    get field() {
        return this._field
    }

    get value() {
        return this._value
    }

    get operator() {
        return this._operator
    }

    equals(other: Filter): boolean {
        return (
            other.value.equals(this.value) &&
            other.field.equals(this.field) &&
            other.operator.equals(this.operator)
        )
    }
}
