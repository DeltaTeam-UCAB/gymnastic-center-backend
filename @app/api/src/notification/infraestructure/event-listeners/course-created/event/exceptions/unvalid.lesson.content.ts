import { makeDomainErrorFactory } from 'src/core/domain/error/domain.error'

export const UNVALID_LESSON_CONTENT = 'UNVALID_LESSON_CONTENT'

export const unvalidLessonContent = makeDomainErrorFactory({
    name: UNVALID_LESSON_CONTENT,
    message: 'Unvalid lesson content',
})
