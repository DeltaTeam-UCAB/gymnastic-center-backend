import { domainEventFactory } from 'src/core/domain/events/event'
import { CommentID } from '../value-objects/comment.id'

export const COMMENT_DELETED = 'COMMENT_DELETED'

export const commentDeleted = domainEventFactory<{
    id: CommentID
}>(COMMENT_DELETED)
