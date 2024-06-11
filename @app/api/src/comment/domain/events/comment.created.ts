import { domainEventFactory } from 'src/core/domain/events/event'
import { CommentID } from '../value-objects/comment.id'
import { CommentContent } from '../value-objects/comment.content'
import { Client } from '../entities/client'
import { WhoLikedID } from '../value-objects/who-liked.id'
import { WhoDislikedID } from '../value-objects/who-disliked.id'
import { Target } from '../value-objects/target'

export const COMMENT_CREATED = 'COMMENT_CREATED'

export const commentCreated = domainEventFactory<{
    id: CommentID
    content: CommentContent
    client: Client
    whoLiked: WhoLikedID[]
    whoDisliked: WhoDislikedID[]
    target: Target
}>(COMMENT_CREATED)
