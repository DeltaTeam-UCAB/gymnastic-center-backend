import { ValueObject } from 'src/core/domain/value-objects/value.object'
import { unvalidBlogDate } from '../exceptions/unvalid.blod.date'

export class BlogDate implements ValueObject<BlogDate> {
    constructor(private _date: Date) {
        if (!this._date) throw unvalidBlogDate()
    }

    get date() {
        return this._date
    }

    equals(other?: BlogDate | undefined): boolean {
        return other?.date === this.date
    }
}
