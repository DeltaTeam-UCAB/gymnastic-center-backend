import { domainEventFactory } from 'src/core/domain/events/event'
import { CourseID } from '../value-objects/course.id'
import { Trainer } from '../entities/trainer'

export const COURSE_TRAINER_CHANGED = 'COURSE_TRAINER_CHANGED'

export const courseTrainerChanged = domainEventFactory<{
    id: CourseID
    trainer: Trainer
}>(COURSE_TRAINER_CHANGED)
