import { makeDomainErrorFactory } from 'src/core/domain/error/domain.error'

export const LESSON_NOT_FOUND = 'LESSON_NOT_FOUND'

export const lessonNotFound = makeDomainErrorFactory({
    name: LESSON_NOT_FOUND,
    message: 'Lesson not found',
})
