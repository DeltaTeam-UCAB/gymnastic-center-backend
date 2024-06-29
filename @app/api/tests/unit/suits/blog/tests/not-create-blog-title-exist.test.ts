import { Result } from '../../../../../src/core/application/result-handler/result.handler'
import { IdGeneratorMock } from './utils/id.generator.mock'
import { DateProviderMock } from '../../course/tests/utils/date.provider.mock'
import { BlogRepositoryMock } from './utils/blog.repository.mock'
import { CreateBlogDTO } from '../../../../../src/blog/application/commands/create/types/dto'
import { CreateBlogResponse } from '../../../../../src/blog/application/commands/create/types/response'
import { BLOG_TITLE_EXIST } from '../../../../../src/blog/application/errors/blog.title.exists'
import { CategoryRepositoryMock } from './utils/category.repository.mock'
import { TrainerRepositoryMock } from './utils/trainer.repository.mock'
import { decorateCreateCommand } from './utils/decorate.create.command.factory'
import { createTrainer } from './utils/trainer.factory'
import { createCategory } from './utils/category.factory'
import { createBlog } from './utils/blog.factory'

export const name = 'Should not create blog if title exist'
const date = new DateProviderMock(new Date())
export const body = async () => {
    const blogId = '84821c3f-0e66-4bf4-a3a8-520e42e50752'
    const trainerId = '84821c3f-0e84-4bf4-a3a8-520e42e54121'
    const categoryId = '84821c3f-0e66-4bf4-a3a8-520e42e54125'
    const imageId = '84821c3f-0e66-4bf4-a3a8-520e42e54147'
    const trainer = createTrainer({
        id: trainerId,
        name: 'trainer name test',
    })
    const category = createCategory({
        id: categoryId,
        name: 'category name test',
    })
    // const image = createImage({
    //     id: imageId,
    //     src: 'image source test',
    // })
    const categoryRepository = new CategoryRepositoryMock([category])
    const trainerRepository = new TrainerRepositoryMock([trainer])
    //const imageRepository = new ImageRepositoryMock([image])
    const blogBaseData = {
        title: 'test blog',
        body: 'test made for blog body',
        images: [imageId],
        tags: ['tag1', 'tag2'],
        category: categoryId,
        trainer: trainerId,
        date: date.current,
    } satisfies CreateBlogDTO
    const blogRepository = new BlogRepositoryMock([
        createBlog({
            title: 'test blog',
        }),
    ])
    const decoratedCommand = decorateCreateCommand(
        new IdGeneratorMock(blogId),
        blogRepository,
        trainerRepository,
        categoryRepository,
    )
    const result: Result<CreateBlogResponse> = await decoratedCommand.execute(
        blogBaseData,
    )
    result.handleError((e) => {
        lookFor(e.name).equals(BLOG_TITLE_EXIST)
    })
}
