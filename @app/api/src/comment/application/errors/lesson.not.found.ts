import { makeApplicationErrorFactory } from 'src/core/application/error/application.error'

export const LESSON_NOT_FOUND = 'LESSON_NOT_FOUND' as const

export const lessonNotFoundError = makeApplicationErrorFactory({
    name: LESSON_NOT_FOUND,
    message: 'Lesson not found',
})
