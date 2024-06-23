import { makeDomainErrorFactory } from 'src/core/domain/error/domain.error'

export const UNVALID_LESSON_ID = 'UNVALID_LESSON_ID'

export const unvalidLessonId = makeDomainErrorFactory({
    name: UNVALID_LESSON_ID,
    message: 'Unvalid lesson id',
})
