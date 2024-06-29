import { CreateBlogCommand } from '../../../../../src/blog/application/commands/create/create.blog.command'
import { IdGeneratorMock } from './utils/id.generator.mock'
import { BlogRepositoryMock } from './utils/blog.repository.mock'
import { DateProviderMock } from '../../course/tests/utils/date.provider.mock'
import { CreateBlogDTO } from '../../../../../../api/src/blog/application/commands/create/types/dto'
import { CategoryRepositoryMock } from './utils/category.repository.mock'
import { TrainerRepositoryMock } from './utils/trainer.repository.mock'
import { createBlog } from './utils/blog.factory'
import { createTrainer } from './utils/trainer.factory'
import { createCategory } from './utils/category.factory'

export const name = 'Should create blog whit valid data'
export const body = async () => {
    const date = new DateProviderMock(new Date())
    const blogId = '84821c3f-0e66-4bf4-a3a8-520e42e50752'
    const trainerId = '84821c3f-0e84-4bf4-a3a8-520e42e54121'
    const categoryId = '84821c3f-0e66-4bf4-a3a8-520e42e54125'
    const trainer = createTrainer({
        id: trainerId,
        name: 'trainer name test',
    })
    const category = createCategory({
        id: categoryId,
        name: 'category name test',
    })
    const blog = createBlog({
        id: blogId,
        title: 'test blog',
        body: 'test made for blog body',
        images: [],
        tags: [],
        category: categoryId,
        trainer: trainerId,
        date: date.current,
    })
    const blogBaseData = {
        title: 'title test',
        body: 'body test',
        images: [],
        tags: [],
        category: categoryId,
        trainer: trainerId,
        date: date.current,
    } satisfies CreateBlogDTO
    const blogRepository = new BlogRepositoryMock([blog])
    const trainerRepository = new TrainerRepositoryMock([trainer])
    const categoryRepository = new CategoryRepositoryMock([category])
    const result = await new CreateBlogCommand(
        new IdGeneratorMock(blogId),
        blogRepository,
        trainerRepository,
        categoryRepository,
    ).execute(blogBaseData)
    lookFor(result.isError()).equals(false)
}
