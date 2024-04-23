import { ValueObject } from 'src/core/domain/value-objects/value.object'

export class OrderField implements ValueObject<OrderField> {
    constructor(private field: string) {
        if (!field) throw new Error('Not field provided')
    }

    get value() {
        return this.field
    }

    equals(other: OrderField): boolean {
        return other.value === this.value
    }
}
