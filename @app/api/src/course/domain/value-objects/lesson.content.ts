import { ValueObject } from 'src/core/domain/value-objects/value.object'
import { unvalidLessonContent } from '../exceptions/unvalid.lesson.content'

export class LessonContent implements ValueObject<LessonContent> {
    constructor(private _content: string) {
        if (_content.length < 4) throw unvalidLessonContent()
    }
    get content() {
        return this._content
    }
    equals(other?: LessonContent | undefined): boolean {
        return other?.content === this.content
    }
}
