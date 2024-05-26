import { makeApplicationErrorFactory } from 'src/core/application/error/application.error'

export const LESSON_NOT_EXIST = 'LESSON_NOT_EXIST' as const

export const lessonNotExistError = makeApplicationErrorFactory({
    name: LESSON_NOT_EXIST,
    message: 'Lesson not exist',
})
