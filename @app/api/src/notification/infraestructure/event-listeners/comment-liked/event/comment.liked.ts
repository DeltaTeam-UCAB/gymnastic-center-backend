import { domainEventFactory } from 'src/core/domain/events/event'
import { CommentID } from './value-objects/comment.id'
import { ClientID } from './value-objects/client.id'

export const COMMENT_LIKED = 'COMMENT_LIKED'

export const commentLiked = domainEventFactory<{
    id: CommentID
    whoLiked: ClientID
}>(COMMENT_LIKED)
