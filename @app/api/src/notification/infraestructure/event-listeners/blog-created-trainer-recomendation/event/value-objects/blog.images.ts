import { ValueObject } from 'src/core/domain/value-objects/value.object'
import { regExpUUID } from 'src/utils/regexps/uuid'
import { unvalidBlogImage } from '../exceptions/unvalid.blog.image'

export class BlogImage implements ValueObject<BlogImage> {
    constructor(private _image: string) {
        if (!regExpUUID.test(_image)) throw unvalidBlogImage()
    }
    get image() {
        return this._image
    }

    equals(other?: BlogImage | undefined): boolean {
        return other?.image === this.image
    }
}
