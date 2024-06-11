import { domainEventFactory } from 'src/core/domain/events/event'
import { CommentID } from '../value-objects/comment.id'
import { WhoDislikedID } from '../value-objects/who-disliked.id'

export const COMMENT_REMOVED_DISLIKE = 'COMMENT_REMOVED_DISLIKE'

export const commentRemovedDislike = domainEventFactory<{
    id: CommentID
    whoRemovedDislike: WhoDislikedID
}>(COMMENT_REMOVED_DISLIKE)
