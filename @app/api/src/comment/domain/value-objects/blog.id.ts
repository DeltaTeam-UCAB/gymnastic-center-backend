import { ValueObject } from 'src/core/domain/value-objects/value.object'
import { regExpUUID } from 'src/utils/regexps/uuid'
import { unvalidBlogId } from 'src/comment/domain/exceptions/unvalid.blog.id'

export class BlogID implements ValueObject<BlogID> {
    constructor(private _id: string) {
        if (!regExpUUID.test(_id)) throw unvalidBlogId()
    }
    get id() {
        return this._id
    }
    equals(other?: BlogID | undefined): boolean {
        return other?.id === this.id
    }
}
