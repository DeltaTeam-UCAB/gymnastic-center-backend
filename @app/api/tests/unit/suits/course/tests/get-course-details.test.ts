import { GetCourseDetailsQuery } from '../../../../../src/course/application/queries/courseDetails/get.courseDetails.query'
import { CourseRepositoryMock } from './utils/course.repository.mock'
import { ImageRepositoryMock } from '../../image/tests/utils/image.repository.mock'
import { courseDetailsDto } from '../../../../../src/course/application/queries/courseDetails/types/dto'
import { LessonRepositoryMock } from '../../lesson/tests/utils/lesson.repository.mock'
import { createCourse } from './utils/course.factory'
import { createImage } from '../../image/tests/utils/image.factory'
import { createLesson } from '../../lesson/tests/utils/lesson.factory'

export const name = 'Should bring all the details of a course'

export const body = async () => {
    const courseId = '987564321'
    const imageId = '43215678'
    const courseData = {
        courseId: courseId,
    } satisfies courseDetailsDto

    const courseRepo = new CourseRepositoryMock([
        createCourse({
            id: courseId,
            title: 'course title',
            description: 'course description',
            instructor: 'course instructor',
            calories: 100,
            category: 'Yoga',
            imageId: imageId,
        }),
    ])
    const imageRepo = new ImageRepositoryMock([
        createImage({
            id: imageId,
            src: 'path',
        }),
    ])
    const lessonRepo = new LessonRepositoryMock([
        createLesson({
            id: '987653',
            name: 'lesson test name',
            description: 'lesson description',
            courseId: courseId,
            videoId: '87912',
            order: 1,
            waitTime: 100,
            burnedCalories: 100,
        }),
    ])
    const getCourseDetailsQuery = new GetCourseDetailsQuery(
        courseRepo,
        imageRepo,
        lessonRepo,
    )
    const resultCourse = await getCourseDetailsQuery.execute(courseData)

    lookFor(resultCourse.unwrap()).toDeepEqual({
        title: 'course title',
        description: 'course description',
        calories: 100,
        instructor: 'course instructor',
        category: 'Yoga',
        image: 'path',
        lessons: [
            {
                id: '987653',
                name: 'lesson test name',
                description: 'lesson description',
                courseId: courseId,
                videoId: '87912',
                order: 1,
                waitTime: 100,
                burnedCalories: 100,
            },
        ],
    })
}
