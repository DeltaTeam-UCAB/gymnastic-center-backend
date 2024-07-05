import { ValueObject } from 'src/core/domain/value-objects/value.object'
import { regExpUUID } from 'src/utils/regexps/uuid'
import { unvalidLessonVideo } from '../exceptions/unvalid.lesson.video'

export class LessonVideo implements ValueObject<LessonVideo> {
    constructor(private _video: string) {
        if (!regExpUUID.test(_video)) throw unvalidLessonVideo()
    }
    get video() {
        return this._video
    }
    equals(other?: LessonVideo | undefined): boolean {
        return other?.video === this.video
    }
}
