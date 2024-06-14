import { ValueObject } from 'src/core/domain/value-objects/value.object'
import { unvalidCourseTitle } from '../exceptions/unvalid.course.title'

export class CourseTitle implements ValueObject<CourseTitle> {
    constructor(private _title: string) {
        if (_title.length < 6) throw unvalidCourseTitle()
    }
    get title() {
        return this._title
    }
    equals(other?: CourseTitle | undefined): boolean {
        return other?.title === this.title
    }
}
