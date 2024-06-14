import { domainEventFactory } from 'src/core/domain/events/event'
import { BlogId } from '../value-objects/blog.id'
import { Trainer } from '../entities/trainer'

export const BLOG_TRAINER_CHANGED = 'BLOG_TRAINER_CHANGED'

export const blogTrainerChanged = domainEventFactory<{
    id: BlogId
    trainer: Trainer
}>(BLOG_TRAINER_CHANGED)
