import { domainEventFactory } from 'src/core/domain/events/event'
import { CommentID } from '../value-objects/comment.id'
import { WhoDislikedID } from '../value-objects/who-disliked.id'

export const COMMENT_DISLIKED = 'COMMENT_DISLIKED'

export const commentDisliked = domainEventFactory<{
    id: CommentID
    whoDisliked: WhoDislikedID
}>(COMMENT_DISLIKED)
