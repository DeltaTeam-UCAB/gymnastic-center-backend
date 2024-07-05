import { domainEventFactory } from 'src/core/domain/events/event'
import { BlogId } from './value-objects/blog.id'

export const BLOG_DELETED = 'BLOG_DELETED'

export const blogDeleted = domainEventFactory<{
    id: BlogId
}>(BLOG_DELETED)
