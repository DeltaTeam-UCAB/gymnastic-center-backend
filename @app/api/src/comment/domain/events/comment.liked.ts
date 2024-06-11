import { domainEventFactory } from 'src/core/domain/events/event'
import { CommentID } from '../value-objects/comment.id'
import { WhoLikedID } from '../value-objects/who-liked.id'

export const COMMENT_LIKED = 'COMMENT_LIKED'

export const commentLiked = domainEventFactory<{
    id: CommentID
    whoLiked: WhoLikedID
}>(COMMENT_LIKED)
