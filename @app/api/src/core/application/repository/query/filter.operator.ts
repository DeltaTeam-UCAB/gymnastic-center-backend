import { Operator } from './operator'
import { ValueObject } from 'src/core/domain/value-objects/value.object'

export class FilterOperator implements ValueObject<FilterOperator> {
    constructor(private operator: Operator) {}

    get value() {
        return this.operator
    }

    equals(other: FilterOperator) {
        return other.value === this.value
    }
}
