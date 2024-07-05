import { ValueObject } from 'src/core/domain/value-objects/value.object'
import { unvalidBlogBody } from '../exceptions/unvalid.blog.body'

export class BlogBody implements ValueObject<BlogBody> {
    constructor(private _body: string) {
        if (_body.length < 5) throw unvalidBlogBody()
    }
    get body() {
        return this._body
    }

    equals(other?: BlogBody | undefined): boolean {
        return other?._body === this.body
    }
}
