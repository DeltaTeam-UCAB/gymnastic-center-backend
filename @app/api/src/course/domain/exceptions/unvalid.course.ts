import { makeDomainErrorFactory } from 'src/core/domain/error/domain.error'

export const UNVALID_COURSE = 'UNVALID_COURSE'

export const unvalidCourse = makeDomainErrorFactory({
    name: UNVALID_COURSE,
    message: 'Unvalid course',
})
