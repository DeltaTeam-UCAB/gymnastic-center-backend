import { ValueObject } from 'src/core/domain/value-objects/value.object'
import { unvalidBlogTag } from '../exceptions/unvalid.blog.tag'

export class BlogTag implements ValueObject<BlogTag> {
    constructor(private _tag: string) {
        if (_tag.length < 4) throw unvalidBlogTag()
    }
    get tag() {
        return this._tag
    }
    equals(other?: BlogTag | undefined): boolean {
        return other?.tag === this.tag
    }
}
