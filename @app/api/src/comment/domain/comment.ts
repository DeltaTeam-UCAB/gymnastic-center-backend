import { AggregateRoot } from 'src/core/domain/aggregates/aggregate.root'
import { CommentID } from './value-objects/comment.id'
import { CommentContent } from './value-objects/comment.content'
import { Client } from './entities/client'
import { WhoDislikedID } from './value-objects/who-disliked.id'
import { WhoLikedID } from './value-objects/who-liked.id'
import { Target } from './value-objects/target'
import { commentCreated } from './events/comment.created'
import { commentLiked } from './events/comment.liked'
import { unvalidComment } from './exceptions/unvalid.comment'
import { commentDisliked } from './events/comment.disliked'
import { commentrRemovedLike as commentRemovedLike } from './events/comment.removed.like'
import { commentRemovedDislike } from './events/comment.removed.dislike'
import { commentContentChanged } from './events/comment.content.changed'

export class Comment extends AggregateRoot<CommentID> {
    constructor(
        id: CommentID,
        private data: {
            content: CommentContent
            client: Client
            whoLiked: WhoLikedID[]
            whoDisliked: WhoDislikedID[]
            target: Target
        },
    ) {
        super(id)
        this.publish(
            commentCreated({
                id,
                ...data,
            }),
        )
    }

    get content() {
        return this.data.content
    }

    get client() {
        return this.data.client
    }

    get whoLiked() {
        return this.data.whoLiked
    }

    get whoDisliked() {
        return this.data.whoDisliked
    }

    get target() {
        return this.data.target
    }

    like(whoLiked: WhoLikedID) {
        this.data.whoLiked.push(whoLiked)
        this.publish(
            commentLiked({
                id: this.id,
                whoLiked,
            }),
        )
    }

    dislike(whoDisliked: WhoDislikedID) {
        this.data.whoDisliked.push(whoDisliked)
        this.publish(
            commentDisliked({
                id: this.id,
                whoDisliked,
            }),
        )
    }

    removeLike(whoLiked: WhoLikedID) {
        this.data.whoLiked.filter((l) => !l.equals(whoLiked))
        this.publish(
            commentRemovedLike({
                id: this.id,
                whoRemovedLike: whoLiked,
            }),
        )
    }

    removeDislike(whoDisliked: WhoDislikedID) {
        this.data.whoDisliked.filter((d) => !d.equals(whoDisliked))
        this.publish(
            commentRemovedDislike({
                id: this.id,
                whoRemovedDislike: whoDisliked,
            }),
        )
    }

    changeContent(content: CommentContent) {
        this.data.content = content
        this.publish(
            commentContentChanged({
                id: this.id,
                content,
            }),
        )
    }

    validateState(): void {
        if (
            !this.id ||
            !this.content ||
            !this.client ||
            !this.whoLiked ||
            !this.whoDisliked ||
            !this.target
        )
            throw unvalidComment()
    }
}
