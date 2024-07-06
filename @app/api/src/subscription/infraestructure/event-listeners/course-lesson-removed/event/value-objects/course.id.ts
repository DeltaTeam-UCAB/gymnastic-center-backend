import { ValueObject } from 'src/core/domain/value-objects/value.object'
import { regExpUUID } from 'src/utils/regexps/uuid'
import { unvalidCourseId } from '../exceptions/unvalid.course.id'

export class CourseID implements ValueObject<CourseID> {
    constructor(private _id: string) {
        if (!regExpUUID.test(_id)) throw unvalidCourseId()
    }
    get id() {
        return this._id
    }
    equals(other?: CourseID | undefined): boolean {
        return other?.id === this.id
    }
}
