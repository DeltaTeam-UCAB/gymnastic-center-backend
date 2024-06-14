import { ValueObject } from 'src/core/domain/value-objects/value.object'
import { unvalidCommentId } from '../exceptions/unvalid.comment.id'

export class CommentContent implements ValueObject<CommentContent> {
    constructor(private _content: string) {
        const contentLenght = _content.length
        if (contentLenght < 1 || contentLenght > 200) throw unvalidCommentId()
    }

    get content() {
        return this._content
    }

    equals(other?: CommentContent | undefined): boolean {
        return other?.content === this.content
    }
}
