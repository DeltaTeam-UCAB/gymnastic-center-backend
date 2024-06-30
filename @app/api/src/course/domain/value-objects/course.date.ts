import { ValueObject } from 'src/core/domain/value-objects/value.object'

export class CourseDate implements ValueObject<CourseDate> {
    constructor(private _date: Date) {}

    equals(other?: CourseDate | undefined): boolean {
        return this.date.getTime() === other?.date.getTime()
    }

    get date() {
        return this._date
    }
}
