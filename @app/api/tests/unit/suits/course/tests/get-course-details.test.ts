import { createCourse } from './utils/course.factory'
import { CourseRepositoryMock } from './utils/course.repository.mock'
import { createImage } from './utils/image.factory'
import { ImageRepositoryMock } from './utils/image.repository.mock'
import { createVideo } from './utils/video.factory'
import { VideoRepositoryMock } from './utils/video.repository.mock'
import { GetCourseDetailsQuery } from '../../../../../src/course/application/queries/courseDetails/get.courseDetails.query'
import { createLesson } from './utils/lesson.factory'
import { Result } from '../../../../../src/core/application/result-handler/result.handler'
import { GetCourseDetailsResponse } from '../../../../../src/course/application/queries/courseDetails/types/response'

export const name = 'Should bring all the details of a course'

export const body = async () => {
    const imageId = '9e68f321-0b22-4a95-adf3-083d64cf2f28'
    const image = createImage({
        id: imageId,
    })
    const imageRepository = new ImageRepositoryMock([image])
    const videoId = '96737b3c-96a1-4795-b32b-3beec712b9d6'
    const video = createVideo({
        id: videoId,
    })
    const videoRepository = new VideoRepositoryMock([video])
    const categoryId = '901ddd30-8331-4b11-a1a6-ec2bf87f7a1f'
    const categoryName = 'category test name'
    const trainerId = '823f2b7e-f323-46be-99ea-7ab16c848b1e'
    const trainerName = 'test trainer name'
    const courseId = '7c51eba6-943b-4ecd-9dfc-2f59f8b6b4d2'
    const lessonId = 'a5b61d8e-76f1-4854-aff3-32252c479b4d'
    const lesson = createLesson({
        id: lessonId,
        video: videoId,
    })
    const course = createCourse({
        id: courseId,
        category: {
            id: categoryId,
            name: categoryName,
        },
        trainer: {
            id: trainerId,
            name: trainerName,
        },
        imageId: imageId,
        lessons: [lesson],
    })
    const courseRepository = new CourseRepositoryMock([course])
    const result: Result<GetCourseDetailsResponse> =
        await new GetCourseDetailsQuery(
            courseRepository,
            imageRepository,
            videoRepository,
        ).execute({
            id: courseId,
        })
    lookFor(result.unwrap()).toDeepEqual({
        id: course.id.id,
        title: course.title.title,
        description: course.description.description,
        level: course.level.level,
        image: image.src,
        trainer: {
            id: trainerId,
            name: trainerName,
        },
        category: categoryName,
        tags: [],
        date: course.creationDate.date,
        lessons: [
            {
                id: lesson.id,
                title: lesson.title,
                content: lesson.content,
                video: video.src,
                order: lesson.order,
            },
        ],
    })
}
