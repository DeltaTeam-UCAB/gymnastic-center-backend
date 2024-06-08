import { makeDomainErrorFactory } from 'src/core/domain/error/domain.error'

export const UNVALID_COURSE_TAG = 'UNVALID_COURSE_TAG'

export const unvalidCourseTag = makeDomainErrorFactory({
    name: UNVALID_COURSE_TAG,
    message: 'Unvalid course tag',
})
