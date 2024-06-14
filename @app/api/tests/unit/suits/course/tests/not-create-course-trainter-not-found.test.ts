import { IDGeneratorMock } from './utils/id.generator.mock'
import { DateProviderMock } from './utils/date.provider.mock'
import { CreateCourseDTO } from '../../../../../src/course/application/commands/createCourse/types/dto'
import { CreateCourseCommand } from '../../../../../src/course/application/commands/createCourse/create.course.command'
import { CourseTitleNotExistDecorator } from '../../../../../src/course/application/commands/createCourse/decorators/title.exist.decorator'
import { CategoryExistDecorator } from '../../../../../src/course/application/commands/createCourse/decorators/category.exist.decorator'
import { TrainerExistDecorator } from '../../../../../src/course/application/commands/createCourse/decorators/trainer.exist.decorator'
import { ImagesExistDecorator } from '../../../../../src/course/application/commands/createCourse/decorators/images.exist.decorator'
import { VideosExistDecorator } from '../../../../../src/course/application/commands/createCourse/decorators/videos.exist.decorator'
import { createCategory } from './utils/category.factory'
import { CategoryRepositoryMock } from './utils/category.repository.mock'
import { CourseRepositoryMock } from './utils/course.repository.mock'
import { createImage } from './utils/image.factory'
import { ImageRepositoryMock } from './utils/image.repository.mock'
import { TRAINER_NOT_EXIST } from '../../../../../src/course/application/errors/trainer.not.exist'
import { TrainerRepositoryMock } from './utils/trainer.repository.mock'
import { createVideo } from './utils/video.factory'
import { VideoRepositoryMock } from './utils/video.repository.mock'
import { Result } from '../../../../../src/core/application/result-handler/result.handler'
import { CreateCourseResponse } from '../../../../../src/course/application/commands/createCourse/types/response'

export const name = 'Should not create course with unvalid trainer'
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
    const courseId = '1234567890'
    const dateProvider = new DateProviderMock(new Date())
    const courseBaseData = {
        title: 'test course',
        description: 'test made for course description',
        trainer: trainerId,
        category: categoryId,
        image: imageId,
        tags: [],
        level: '1',
        lessons: [
            {
                title: 'lesson1',
                content: 'test content',
                order: 1,
                video: videoId,
            },
        ],
    } satisfies CreateCourseDTO
    const courseRepo = new CourseRepositoryMock()
    const commandBase = new CreateCourseCommand(
        new IDGeneratorMock(courseId),
        courseRepo,
        dateProvider,
    )
    const commandTitleValidation = new CourseTitleNotExistDecorator(
        commandBase,
        courseRepo,
    )
    const commandWithCategoryValidator = new CategoryExistDecorator(
        commandTitleValidation,
        categoryRepository,
    )
    const commandWithTrainerValidation = new TrainerExistDecorator(
        commandWithCategoryValidator,
        new TrainerRepositoryMock(),
    )
    const commandWithImageValidator = new ImagesExistDecorator(
        commandWithTrainerValidation,
        imageRepository,
    )
    const commandWithVideoValidator = new VideosExistDecorator(
        commandWithImageValidator,
        videoRepository,
    )
    const result: Result<CreateCourseResponse> =
        await commandWithVideoValidator.execute(courseBaseData)
    result.handleError((e) => {
        lookFor(e.name).equals(TRAINER_NOT_EXIST)
    })
}
