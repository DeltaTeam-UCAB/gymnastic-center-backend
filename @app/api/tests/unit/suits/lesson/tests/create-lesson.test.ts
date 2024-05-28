import { IDGeneratorMock } from './utils/id.generator.mock'
import { LessonRepositoryMock } from './utils/lesson.repository.mock'
import { CreateLessonDTO } from '../../../../../src/course/application/commands/createLesson/types/dto'
import { CreateLessonCommand } from '../../../../../src/course/application/commands/createLesson/create.lesson.command'


export const name = 'Should create lesson with valid data'
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
    lookFor(await lessonRepo.getById(lessonId)).toDeepEqual({
        ...lessonBaseData,
        id: lessonId,
    })
}