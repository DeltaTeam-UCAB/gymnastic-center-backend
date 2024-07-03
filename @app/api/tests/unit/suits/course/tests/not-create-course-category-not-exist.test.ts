import { IDGeneratorMock } from './utils/id.generator.mock'
import { DateProviderMock } from './utils/date.provider.mock'
import { CreateCourseDTO } from '../../../../../src/course/application/commands/createCourse/types/dto'
import { CreateCourseCommand } from '../../../../../src/course/application/commands/createCourse/create.course.command'
import { CourseTitleNotExistDecorator } from '../../../../../src/course/application/commands/createCourse/decorators/title.exist.decorator'
import { CategoryExistDecorator } from '../../../../../src/course/application/commands/createCourse/decorators/category.exist.decorator'
import { TrainerExistDecorator } from '../../../../../src/course/application/commands/createCourse/decorators/trainer.exist.decorator'
import { ImagesExistDecorator } from '../../../../../src/course/application/commands/createCourse/decorators/images.exist.decorator'
import { VideosExistDecorator } from '../../../../../src/course/application/commands/createCourse/decorators/videos.exist.decorator'
import { CATEGORY_NOT_EXIST } from '../../../../../src/course/application/errors/category.not.exist'
import { CategoryRepositoryMock } from './utils/category.repository.mock'
import { CourseRepositoryMock } from './utils/course.repository.mock'
import { createImage } from './utils/image.factory'
import { ImageRepositoryMock } from './utils/image.repository.mock'
import { createTrainer } from './utils/trainer.factory'
import { TrainerRepositoryMock } from './utils/trainer.repository.mock'
import { createVideo } from './utils/video.factory'
import { VideoRepositoryMock } from './utils/video.repository.mock'
import { Result } from '../../../../../src/core/application/result-handler/result.handler'
import { CreateCourseResponse } from '../../../../../src/course/application/commands/createCourse/types/response'

export const name = 'Should not create course with unvalid category'
export const body = async () => {
    const imageId = '9fd3da36-e884-4ceb-a6da-cc3e52c35a47'
    const image = createImage({
        id: imageId,
    })
    const imageRepository = new ImageRepositoryMock([image])
    const videoId = 'beff57fd-48d1-4a1b-a441-28d947a3b189'
    const video = createVideo({
        id: videoId,
    })
    const videoRepository = new VideoRepositoryMock([video])
    const categoryId = 'f568e490-2996-41d9-ac71-154b664866a4'
    const categoryRepository = new CategoryRepositoryMock([])
    const trainerId = '44a61cf2-e1c8-4c7e-92f6-f3120dea5167'
    const trainer = createTrainer({
        id: trainerId,
    })
    const trainerRepository = new TrainerRepositoryMock([trainer])
    const courseId = '01fc70fa-d328-479c-a0c2-117aec3ebb2b'
    const dateProvider = new DateProviderMock(new Date())
    const courseBaseData = {
        title: 'test course',
        description: 'test made for course description',
        trainer: trainerId,
        category: categoryId,
        image: imageId,
        tags: [],
        level: 'EASY',
        lessons: [
            {
                title: 'lesson1',
                content: 'test content',
                order: 1,
                video: videoId,
            },
        ],
        weeks: 4,
        hours: 40,
    } satisfies CreateCourseDTO
    const courseRepo = new CourseRepositoryMock()
    const commandBase = new CreateCourseCommand(
        new IDGeneratorMock(courseId),
        courseRepo,
        categoryRepository,
        trainerRepository,
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
        trainerRepository,
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
        lookFor(e.name).equals(CATEGORY_NOT_EXIST)
    })
}
