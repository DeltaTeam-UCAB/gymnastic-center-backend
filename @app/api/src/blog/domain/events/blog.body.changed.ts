import { domainEventFactory } from 'src/core/domain/events/event'
import { BlogBody } from '../value-objects/blog.body'
import { BlogId } from '../value-objects/blog.id'

export const BLOG_BODY_CHANGED = 'BLOG_BODY_CHANGED'

export const blogBodyChanged = domainEventFactory<{
    id: BlogId
    body: BlogBody
}>(BLOG_BODY_CHANGED)
