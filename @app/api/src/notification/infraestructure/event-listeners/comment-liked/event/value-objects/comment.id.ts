import { ValueObject } from 'src/core/domain/value-objects/value.object'
import { regExpUUID } from 'src/utils/regexps/uuid'
import { unvalidCommentId } from '../exceptions/unvalid.comment.id'

export class CommentID implements ValueObject<CommentID> {
    constructor(private _id: string) {
        if (!regExpUUID.test(_id)) throw unvalidCommentId()
    }

    get id() {
        return this._id
    }

    equals(other?: CommentID | undefined): boolean {
        return other?.id === this.id
    }
}
