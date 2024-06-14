import { domainEventFactory } from 'src/core/domain/events/event'
import { BlogId } from '../value-objects/blog.id'
import { BlogTag } from '../value-objects/blog.tag'

export const BLOG_TAG_REMOVED = 'BLOG_TAG_REMOVED'

export const blogTagRemoved = domainEventFactory<{
    id: BlogId
    tag: BlogTag
}>(BLOG_TAG_REMOVED)
