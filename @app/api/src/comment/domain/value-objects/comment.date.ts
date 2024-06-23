import { ValueObject } from 'src/core/domain/value-objects/value.object'

export class CommentDate implements ValueObject<CommentDate> {
    constructor(private _date: Date) {}

    equals(other?: CommentDate | undefined): boolean {
        return this.date.getTime() === other?.date.getTime()
    }

    get date() {
        return this._date
    }
}
