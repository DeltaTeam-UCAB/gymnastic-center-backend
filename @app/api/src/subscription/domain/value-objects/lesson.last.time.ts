import { ValueObject } from 'src/core/domain/value-objects/value.object'
import { unvalidLastTime } from '../exceptions/unvalid.last.time'

export class LessonLastTime implements ValueObject<LessonLastTime> {
    constructor(private _seconds: number) {
        if (_seconds < 0) throw unvalidLastTime()
    }

    get seconds() {
        return this._seconds
    }

    equals(other?: LessonLastTime | undefined): boolean {
        return other?.seconds === this.seconds
    }
}
