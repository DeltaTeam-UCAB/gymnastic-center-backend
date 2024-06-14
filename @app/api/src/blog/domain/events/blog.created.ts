import { domainEventFactory } from 'src/core/domain/events/event'
import { BlogId } from '../value-objects/blog.id'
import { BlogTitle } from '../value-objects/blog.title'
import { BlogBody } from '../value-objects/blog.body'
import { BlogImage } from '../value-objects/blog.images'
import { BlogTag } from '../value-objects/blog.tag'
import { Trainer } from '../entities/trainer'
import { Category } from '../entities/category'

export const BLOG_CREATED = 'BLOG_CREATED'

export const blogCreated = domainEventFactory<{
    id: BlogId
    title: BlogTitle
    body: BlogBody
    images: BlogImage[]
    tags: BlogTag[]
    trainer: Trainer
    category: Category
}>(BLOG_CREATED)
