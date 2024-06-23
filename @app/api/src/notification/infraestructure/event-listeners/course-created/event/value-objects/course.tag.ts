import { ValueObject } from 'src/core/domain/value-objects/value.object'
import { unvalidCourseTag } from '../exceptions/unvalid.course.tag'

export class CourseTag implements ValueObject<CourseTag> {
    constructor(private _tag: string) {
        if (_tag.length < 4) throw unvalidCourseTag()
    }
    get tag() {
        return this._tag
    }
    equals(other?: CourseTag | undefined): boolean {
        return other?.tag === this.tag
    }
}
