import { Result } from '../../../../../src/core/application/result-handler/result.handler'
import { IDGeneratorMock } from './utils/id.generator.mock'
import { CreateLessonDTO } from '../../../../../src/course/application/commands/createLesson/types/dto'
import { CreateLessonCommand } from '../../../../../src/course/application/commands/createLesson/create.lesson.command'
import { LessonRepositoryMock } from './utils/lesson.repository.mock'
import { CreateLessonResponse } from '../../../../../src/course/application/commands/createLesson/types/response'
import { LESSON_NAME_EXIST } from '../../../../../src/course/application/errors/lesson.name.exist'
import { createLesson } from './utils/lesson.factory'

export const name = 'Should not create lesson with an existing title'
export const body = async () => {
    const lessonBaseData = {
        name: 'test lesson',
        description: 'test made for lesson description',
        courseId: '6543210987',
        videoId: '9876543210',
        order: 1234,
        waitTime: 321,
        burnedCalories: 1234,
    } satisfies CreateLessonDTO
    const lessonRepo = new LessonRepositoryMock([
        createLesson({
            name: 'test lesson',
        }),
    ])
    const result: Result<CreateLessonResponse> = await new CreateLessonCommand(
        new IDGeneratorMock(),
        lessonRepo,
    ).execute(lessonBaseData)
    result.handleError((e) => {
        lookFor(e.name).equals(LESSON_NAME_EXIST)
    })
}
