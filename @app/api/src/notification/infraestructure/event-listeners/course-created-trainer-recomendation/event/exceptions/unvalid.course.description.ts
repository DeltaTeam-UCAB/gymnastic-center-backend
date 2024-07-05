import { makeDomainErrorFactory } from 'src/core/domain/error/domain.error'

export const UNVALID_COURSE_DESCRIPTION = 'UNVALID_COURSE_DESCRIPTION'

export const unvalidCourseDescription = makeDomainErrorFactory({
    name: UNVALID_COURSE_DESCRIPTION,
    message: 'Unvalid course description',
})
