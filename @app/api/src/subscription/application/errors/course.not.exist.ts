import { makeApplicationErrorFactory } from 'src/core/application/error/application.error'

export const COURSE_NOT_EXIST = 'COURSE_NOT_EXIST'

export const courseNotExist = makeApplicationErrorFactory({
    name: COURSE_NOT_EXIST,
    message: 'Course not exist',
})
