import { domainEventFactory } from 'src/core/domain/events/event'
import { BlogId } from '../value-objects/blog.id'
import { BlogTitle } from '../value-objects/blog.title'

export const BLOG_TITLE_CHANGED = 'BLOG_TITLE_CHANGED'

export const blogTitleChanged = domainEventFactory<{
    id: BlogId
    title: BlogTitle
}>(BLOG_TITLE_CHANGED)
