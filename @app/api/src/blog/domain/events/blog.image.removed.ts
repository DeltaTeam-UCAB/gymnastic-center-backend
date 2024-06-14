import { domainEventFactory } from 'src/core/domain/events/event'
import { BlogId } from '../value-objects/blog.id'
import { BlogImage } from '../value-objects/blog.images'

export const BLOG_IMAGE_REMOVED = 'BLOG_IMAGE_REMOVED'

export const blogImageRemoved = domainEventFactory<{
    id: BlogId
    image: BlogImage
}>(BLOG_IMAGE_REMOVED)
