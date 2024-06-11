import { makeDomainErrorFactory } from 'src/core/domain/error/domain.error'

export const UNVALID_TARGET_LESSON_ID = 'UNVALID_TARGET_LESSON_ID'

export const unvalidTargetLessonId = makeDomainErrorFactory({
    name: UNVALID_TARGET_LESSON_ID,
    message: 'Unvalid target lesson id',
})
