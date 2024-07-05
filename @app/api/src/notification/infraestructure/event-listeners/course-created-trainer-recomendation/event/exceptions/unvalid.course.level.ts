import { makeDomainErrorFactory } from 'src/core/domain/error/domain.error'

export const UNVALID_COURSE_LEVEL = 'UNVALID_COURSE_LEVEL'

export const unvalidCourseLevel = makeDomainErrorFactory({
    name: UNVALID_COURSE_LEVEL,
    message: 'Unvalid course level',
})
