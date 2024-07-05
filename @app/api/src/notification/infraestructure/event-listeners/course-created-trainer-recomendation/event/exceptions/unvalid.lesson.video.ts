import { makeDomainErrorFactory } from 'src/core/domain/error/domain.error'

export const UNVALID_LESSON_VIDEO = 'UNVALID_LESSON_VIDEO'

export const unvalidLessonVideo = makeDomainErrorFactory({
    name: UNVALID_LESSON_VIDEO,
    message: 'Unvalid lesson video',
})
