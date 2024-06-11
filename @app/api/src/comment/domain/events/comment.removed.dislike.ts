import { domainEventFactory } from 'src/core/domain/events/event'
import { CommentID } from '../value-objects/comment.id'
import { ClientID } from '../value-objects/client.id'

export const COMMENT_REMOVED_DISLIKE = 'COMMENT_REMOVED_DISLIKE'

export const commentRemovedDislike = domainEventFactory<{
    id: CommentID
    whoRemovedDislike: ClientID
}>(COMMENT_REMOVED_DISLIKE)
