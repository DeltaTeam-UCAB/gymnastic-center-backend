import { makeDomainErrorFactory } from 'src/core/domain/error/domain.error'

export const UNVALID_COURSE_IMAGE = 'UNVALID_COURSE_IMAGE'

export const unvalidCourseImage = makeDomainErrorFactory({
    name: UNVALID_COURSE_IMAGE,
    message: 'Unvalid course image',
})
