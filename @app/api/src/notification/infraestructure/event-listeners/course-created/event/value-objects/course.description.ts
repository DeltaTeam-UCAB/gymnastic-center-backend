import { ValueObject } from 'src/core/domain/value-objects/value.object'
import { unvalidCourseDescription } from '../exceptions/unvalid.course.description'

export class CourseDescription implements ValueObject<CourseDescription> {
    constructor(private _description: string) {
        if (_description.length < 6) throw unvalidCourseDescription()
    }
    get description() {
        return this._description
    }
    equals(other?: CourseDescription | undefined): boolean {
        return other?.description === this.description
    }
}
