import { ValueObject } from 'src/core/domain/value-objects/value.object'
import { regExpUUID } from 'src/utils/regexps/uuid'
import { unvalidBlogId } from '../exceptions/unvalid.blog.id'

export class BlogId implements ValueObject<BlogId> {
    constructor(private _id: string) {
        if (!regExpUUID.test(_id)) throw unvalidBlogId()
    }

    get id() {
        return this._id
    }

    equals(other?: BlogId | undefined): boolean {
        return other?.id === this.id
    }
}
