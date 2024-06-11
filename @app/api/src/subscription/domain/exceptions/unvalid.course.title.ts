import { makeDomainErrorFactory } from 'src/core/domain/error/domain.error'

export const UNVALID_COURSE_TITLE = 'UNVALID_COURSE_TITLE'

export const unvalidCourseTitle = makeDomainErrorFactory({
    name: UNVALID_COURSE_TITLE,
    message: 'Unvalid course title',
})
