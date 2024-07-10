import { ValueObject } from 'src/core/domain/value-objects/value.object'
import { unvalidCourseDuration } from '../exceptions/unvalid.course.duration'

export class CourseDuration implements ValueObject<CourseDuration> {
    constructor(private _weeks: number, private _hours: number) {
        if (_weeks < 0 && _hours < 0) throw unvalidCourseDuration()
    }

    get weeks() {
        return this._weeks
    }

    get hours() {
        return this._hours
    }

    equals(other?: CourseDuration | undefined): boolean {
        return other?.weeks === this.weeks && other.hours === this.hours
    }
}
