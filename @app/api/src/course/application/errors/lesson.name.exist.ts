import { makeApplicationErrorFactory } from 'src/core/application/error/application.error'

export const LESSON_NAME_EXIST = 'LESSON_NAME_EXIST' as const

export const lessonNameExistError = makeApplicationErrorFactory({
    name: LESSON_NAME_EXIST,
    message: 'Lesson name exist',
})
