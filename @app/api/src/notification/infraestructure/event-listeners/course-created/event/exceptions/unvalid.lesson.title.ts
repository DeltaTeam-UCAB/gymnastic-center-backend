import { makeDomainErrorFactory } from 'src/core/domain/error/domain.error'

export const UNVALID_LESSON_TITLE = 'UNVALID_LESSON_TITLE'

export const unvalidLessonTitle = makeDomainErrorFactory({
    name: UNVALID_LESSON_TITLE,
    message: 'Unvalid lesson title',
})
