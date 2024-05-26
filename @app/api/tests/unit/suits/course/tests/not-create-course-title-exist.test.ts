import { Result } from '../../../../../src/core/application/result-handler/result.handler'
import { CreateCourseDTO } from '../../../../../src/course/application/commands/createCourse/types/dto'
import { CreateCourseCommand } from '../../../../../src/course/application/commands/createCourse/create.course.command'
import { IDGeneratorMock } from './utils/id.generator.mock'
import { CourseRepositoryMock } from './utils/course.repository.mock'
import { CreateCourseResponse } from '../../../../../src/course/application/commands/createCourse/types/response'
import { COURSE_TITLE_EXIST } from '../../../../../src/course/application/errors/course.title.exist'
import { createCourse } from './utils/course.factory'
import { DateProviderMock } from './utils/date.provider.mock'

export const name = 'Should not create course with an existing title'
const date = new DateProviderMock(new Date())
export const body = async () => {
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
    const courseRepo = new CourseRepositoryMock([
        createCourse({
            title: 'test course',
        }),
    ])
    const result: Result<CreateCourseResponse> = await new CreateCourseCommand(
        new IDGeneratorMock(),
        courseRepo,
    ).execute(courseBaseData)
    result.handleError((e) => {
        lookFor(e.name).equals(COURSE_TITLE_EXIST)
    })
}
