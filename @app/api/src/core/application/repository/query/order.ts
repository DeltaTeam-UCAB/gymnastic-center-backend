import { OrderField } from './order.field'
import { OrderType } from './order.type'
import { ValueObject } from 'src/core/domain/value-objects/value.object'

export class Order implements ValueObject<Order> {
    constructor(private _field: OrderField, private _type: OrderType) {
        if (!this.field || !this.type) throw new Error('Invalid order')
    }

    get field() {
        return this._field
    }

    get type() {
        return this._type
    }

    equals(other: Order): boolean {
        return other.type.equals(this.type) && other.field.equals(this.field)
    }
}
