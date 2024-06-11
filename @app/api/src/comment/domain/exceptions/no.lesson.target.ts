import { makeDomainErrorFactory } from 'src/core/domain/error/domain.error'

export const NO_LESSON_TARGET = 'NO_LESSON_TARGET'

export const noLessonTarget = makeDomainErrorFactory({
    name: NO_LESSON_TARGET,
    message: 'Target is not lesson type',
})
