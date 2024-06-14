import { createCategory } from './utils/category.factory'
import { CategoryRepositoryMock } from './utils/category.repository.mock'
import { createCourse } from './utils/course.factory'
import { CourseRepositoryMock } from './utils/course.repository.mock'
import { createImage } from './utils/image.factory'
import { ImageRepositoryMock } from './utils/image.repository.mock'
import { createTrainer } from './utils/trainer.factory'
import { TrainerRepositoryMock } from './utils/trainer.repository.mock'
import { createVideo } from './utils/video.factory'
import { VideoRepositoryMock } from './utils/video.repository.mock'
import { GetCourseDetailsQuery } from '../../../../../src/course/application/queries/courseDetails/get.courseDetails.query'
import { createLesson } from './utils/lesson.factory'
import { Result } from '../../../../../src/core/application/result-handler/result.handler'
import { GetCourseDetailsResponse } from '../../../../../src/course/application/queries/courseDetails/types/response'

export const name = 'Should bring all the details of a course'

export const body = async () => {
    const imageId = 'test-image-id'
    const image = createImage({
        id: imageId,
    })
    const imageRepository = new ImageRepositoryMock([image])
    const videoId = 'test-video-id'
    const video = createVideo({
        id: videoId,
    })
    const videoRepository = new VideoRepositoryMock([video])
    const categoryId = 'test-category-id'
    const category = createCategory({
        id: categoryId,
    })
    const categoryRepository = new CategoryRepositoryMock([category])
    const trainerId = 'test-trainer-id'
    const trainer = createTrainer({
        id: trainerId,
    })
    const trainerRepository = new TrainerRepositoryMock([trainer])
    const courseId = 'test-course-id'
    const lessonId = 'test-lesson-id'
    const lesson = createLesson({
        id: lessonId,
        video: videoId,
    })
    const course = createCourse({
        id: courseId,
        category: categoryId,
        trainer: trainerId,
        imageId: imageId,
        lessons: [lesson],
    })
    const courseRepository = new CourseRepositoryMock([course])
    const result: Result<GetCourseDetailsResponse> =
        await new GetCourseDetailsQuery(
            courseRepository,
            imageRepository,
            videoRepository,
            trainerRepository,
            categoryRepository,
        ).execute({
            id: courseId,
        })
    lookFor(result.unwrap()).toDeepEqual({
        id: course.id,
        title: course.title,
        description: course.description,
        level: course.level,
        image: image.src,
        trainer,
        category: category.name,
        tags: [],
        date: course.date,
        lessons: [
            {
                id: lesson.id,
                title: lesson.title,
                content: lesson.content,
                image: undefined,
                video: video.src,
                order: lesson.order,
            },
        ],
    })
}
