import { domainEventFactory } from 'src/core/domain/events/event'
import { BlogId } from '../value-objects/blog.id'
import { Category } from '../entities/category'

export const BLOG_CATEGORY_CHANGED = 'BLOG_CATEGORY_CHANGED'

export const blogCategoryChanged = domainEventFactory<{
    id: BlogId
    category: Category
}>(BLOG_CATEGORY_CHANGED)
