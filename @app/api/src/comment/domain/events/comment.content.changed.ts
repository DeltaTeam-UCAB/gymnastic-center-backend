import { domainEventFactory } from 'src/core/domain/events/event'
import { CommentID } from '../value-objects/comment.id'
import { CommentContent } from '../value-objects/comment.content'

export const COMMENT_CONTENT_CHANGED = 'COMMENT_CONTENT_CHANGED'

export const commentContentChanged = domainEventFactory<{
    id: CommentID
    content: CommentContent
}>(COMMENT_CONTENT_CHANGED)
