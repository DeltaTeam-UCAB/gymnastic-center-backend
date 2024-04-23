import { LogicalOperator } from './logical.operator'
import { Order } from './order'
import { Pagination } from './pagination'

export class Criteria {
    constructor(
        private _operator: LogicalOperator,
        private _order: Order[] = [],
        private _pagination: Pagination = new Pagination(0, 0),
    ) {
        if (!this.operator || !this.pagination)
            throw new Error('Invalid criteria')
    }

    get operator() {
        return this._operator
    }

    get order() {
        return this._order
    }

    get pagination() {
        return this._pagination
    }
}
