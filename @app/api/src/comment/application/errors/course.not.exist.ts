import { makeApplicationErrorFactory } from 'src/core/application/error/application.error'

export const COURSE_NOT_EXIST = 'COURSE_NOT_EXIST' as const

export const courseNotExistError = makeApplicationErrorFactory({
    name: COURSE_NOT_EXIST,
    message: 'Course Not exist',
})
