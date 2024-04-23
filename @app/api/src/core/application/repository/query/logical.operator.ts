import { Filter } from './filter'
import { LogicalOperators } from './logical.operators'

export class LogicalOperator {
    constructor(
        private _elements: (Filter | LogicalOperator)[],
        private _operator: LogicalOperators,
    ) {}

    get elements() {
        return this._elements
    }

    get operator() {
        return this._operator
    }
}
