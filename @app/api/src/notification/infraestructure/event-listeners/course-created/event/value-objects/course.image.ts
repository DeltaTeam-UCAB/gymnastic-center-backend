import { ValueObject } from 'src/core/domain/value-objects/value.object'
import { regExpUUID } from 'src/utils/regexps/uuid'
import { unvalidCourseImage } from '../exceptions/unvalid.course.image'

export class CourseImage implements ValueObject<CourseImage> {
    constructor(private _image: string) {
        if (!regExpUUID.test(_image)) throw unvalidCourseImage()
    }
    get image() {
        return this._image
    }
    equals(other?: CourseImage | undefined): boolean {
        return other?.image === this.image
    }
}
