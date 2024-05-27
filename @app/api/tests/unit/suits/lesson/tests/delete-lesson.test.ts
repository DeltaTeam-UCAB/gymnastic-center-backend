import { IDGeneratorMock } from './utils/id.generator.mock'
import { LessonRepositoryMock } from './utils/lesson.repository.mock'
import { CreateLessonDTO } from '../../../../../src/course/application/commands/createLesson/types/dto'
import { CreateLessonCommand } from '../../../../../src/course/application/commands/createLesson/create.lesson.command'
import { DeleteLessonCommand } from '../../../../../src/course/application/commands/deleteLesson/delete.lesson.command'
import { Result } from '../../../../../src/core/application/result-handler/result.handler'
import { LESSON_NAME_EXIST } from '../../../../../src/course/application/errors/lesson.name.exist'
import { DeleteLessonResponse } from '../../../../../src/course/application/commands/deleteLesson/types/response'

export const name = 'Should delete lesson with valid data'
export const body = async () => {
    const lessonId = '1234567890'
    const lessonBaseData = {
        name: 'test lesson',
        description: 'test made for lesson description',
        courseId: '6543210987',
        videoId: '9876543210',
        order: 1234,
        waitTime: 321,
        burnedCalories: 1234,
    } satisfies CreateLessonDTO
    const lessonRepo = new LessonRepositoryMock()
    await new CreateLessonCommand(
        new IDGeneratorMock(lessonId),
        lessonRepo,
    ).execute(lessonBaseData)
    const result: Result<DeleteLessonResponse> = await new DeleteLessonCommand(lessonRepo).execute(lessonId)  
    lookFor(Result.success(result))
}