import { makeDomainErrorFactory } from 'src/core/domain/error/domain.error'

export const UNVALID_COURSE_ID = 'UNVALID_COURSE_ID'

export const unvalidCourseId = makeDomainErrorFactory({
    name: UNVALID_COURSE_ID,
    message: 'Unvalid course id',
})
