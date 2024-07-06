import { makeDomainErrorFactory } from 'src/core/domain/error/domain.error'

export const LESSON_NOT_EXIST = 'LESSON_NOT_EXIST'

export const lessonNotExist = makeDomainErrorFactory({
    name: LESSON_NOT_EXIST,
    message: 'Lesson not exist',
})
