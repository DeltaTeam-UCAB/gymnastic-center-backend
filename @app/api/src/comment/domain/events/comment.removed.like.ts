import { domainEventFactory } from 'src/core/domain/events/event'
import { CommentID } from '../value-objects/comment.id'
import { WhoLikedID } from '../value-objects/who-liked.id'

export const COMMENT_REMOVED_LIKE = 'COMMENT_REMOVED_LIKE'

export const commentrRemovedLike = domainEventFactory<{
    id: CommentID
    whoRemovedLike: WhoLikedID
}>(COMMENT_REMOVED_LIKE)
