import { domainEventFactory } from 'src/core/domain/events/event'
import { CommentID } from '../value-objects/comment.id'
import { ClientID } from '../value-objects/client.id'

export const COMMENT_REMOVED_LIKE = 'COMMENT_REMOVED_LIKE'

export const commentRemovedLike = domainEventFactory<{
    id: CommentID
    whoRemovedLike: ClientID
}>(COMMENT_REMOVED_LIKE)
