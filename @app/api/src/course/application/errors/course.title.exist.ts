import { makeApplicationErrorFactory } from 'src/core/application/error/application.error'

export const COURSE_TITLE_EXIST = 'COURSE_TITLE_EXIST' as const

export const courseTitleExistError = makeApplicationErrorFactory({
    name: COURSE_TITLE_EXIST,
    message: 'Course title exist',
})
