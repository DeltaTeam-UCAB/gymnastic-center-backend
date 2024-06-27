import { makeDomainErrorFactory } from 'src/core/domain/error/domain.error'

export const UNVALID_COURSE_DURATION = 'UNVALID_COURSE_DURATION'

export const unvalidCourseDuration = makeDomainErrorFactory({
    name: UNVALID_COURSE_DURATION,
    message: 'Unvalid course duration',
})
