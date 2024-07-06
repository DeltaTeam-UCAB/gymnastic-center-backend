import { ValueObject } from 'src/core/domain/value-objects/value.object'
import { regExpUUID } from 'src/utils/regexps/uuid'
import { unvalidLessonId } from '../exceptions/unvalid.lesson.id'

export class LessonID implements ValueObject<LessonID> {
    constructor(private _id: string) {
        if (!regExpUUID.test(_id)) throw unvalidLessonId()
    }
    get id() {
        return this._id
    }
    equals(other?: LessonID | undefined): boolean {
        return other?.id === this.id
    }
}
