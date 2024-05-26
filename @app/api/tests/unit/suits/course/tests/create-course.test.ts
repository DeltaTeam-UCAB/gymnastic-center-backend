import { IDGeneratorMock } from './utils/id.generator.mock'
import { CourseRepositoryMock } from './utils/course.repository.mock'
import { DateProviderMock } from './utils/date.provider.mock'
import { CreateCourseDTO } from '../../../../../src/course/application/commands/createCourse/types/dto'
import { CreateCourseCommand } from '../../../../../src/course/application/commands/createCourse/create.course.command'


export const name = 'Should create course with valid data'
export const body = async () => {
    const courseId = '1234567890'
    const date = new DateProviderMock(new Date())
    const courseBaseData = {
        title: 'test course',
        description: 'test made for course description',
        instructor: 'Instructor name',
        calories: 1234,
        creationDate: date.current,
        category: 'category test',
        videoId: '9876543210',
        imageId: '6543210987',
    } satisfies CreateCourseDTO
    const courseRepo = new CourseRepositoryMock()
    await new CreateCourseCommand(
        new IDGeneratorMock(courseId),
        courseRepo,
    ).execute(courseBaseData)
    lookFor(await courseRepo.getById(courseId)).toDeepEqual({
        ...courseBaseData,
        id: courseId,
    })
}