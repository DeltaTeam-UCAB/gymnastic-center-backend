import { ValueObject } from 'src/core/domain/value-objects/value.object'
import { unvalidLessonTitle } from '../exceptions/unvalid.lesson.title'

export class LessonTitle implements ValueObject<LessonTitle> {
    constructor(private _title: string) {
        if (_title.length < 6) throw unvalidLessonTitle()
    }
    get title() {
        return this._title
    }
    equals(other?: LessonTitle | undefined): boolean {
        return other?.title === this.title
    }
}
