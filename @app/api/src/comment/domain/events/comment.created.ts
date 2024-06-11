import { domainEventFactory } from 'src/core/domain/events/event'
import { CommentID } from '../value-objects/comment.id'
import { CommentContent } from '../value-objects/comment.content'
import { Client } from '../entities/client'
import { ClientID } from '../value-objects/client.id'
import { Target } from '../value-objects/target'

export const COMMENT_CREATED = 'COMMENT_CREATED'

export const commentCreated = domainEventFactory<{
    id: CommentID
    content: CommentContent
    client: Client
    whoLiked: ClientID[]
    whoDisliked: ClientID[]
    target: Target
}>(COMMENT_CREATED)
