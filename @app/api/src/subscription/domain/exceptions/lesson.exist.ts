import { makeDomainErrorFactory } from 'src/core/domain/error/domain.error'

export const LESSON_EXIST = 'LESSON_EXIST'

export const lessonExist = makeDomainErrorFactory({
    name: LESSON_EXIST,
    message: 'Lesson exist',
})
