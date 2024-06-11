import { domainEventFactory } from 'src/core/domain/events/event'
import { CommentID } from '../value-objects/comment.id'
import { ClientID } from '../value-objects/client.id'

export const COMMENT_DISLIKED = 'COMMENT_DISLIKED'

export const commentDisliked = domainEventFactory<{
    id: CommentID
    whoDisliked: ClientID
}>(COMMENT_DISLIKED)
