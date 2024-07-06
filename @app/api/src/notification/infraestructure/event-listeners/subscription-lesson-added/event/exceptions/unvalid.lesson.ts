import { makeDomainErrorFactory } from 'src/core/domain/error/domain.error'

export const UNVALID_LESSON = 'UNVALID_LESSON'

export const unvalidLesson = makeDomainErrorFactory({
    name: UNVALID_LESSON,
    message: 'Unvalid lesson',
})
