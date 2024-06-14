import { ValueObject } from 'src/core/domain/value-objects/value.object'

export class Time implements ValueObject<Time> {
    constructor(private _date: Date) {}

    get date() {
        return this._date
    }

    lessThan(other?: Time) {
        return this.date.getTime() < (other?.date.getTime() ?? 0)
    }

    equals(other?: Time | undefined): boolean {
        return other?.date.getTime() === this.date.getTime()
    }
}
