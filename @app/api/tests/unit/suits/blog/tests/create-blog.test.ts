import { CreateBlogCommand } from '../../../../../src/blog/application/commands/create/create.blog.command'
import { IdGeneratorMock } from './utils/id.generator.mock'
import { BlogRepositoryMock } from './utils/blog.repository.mock'
import { DateProviderMock } from '../../course/tests/utils/date.provider.mock'
import { CreateBlogDTO } from '../../../../../../api/src/blog/application/commands/create/types/dto'

export const name = 'Should create blog whit valid data'
export const body = async () => {
    const blogId = '1234567890'
    const date = new DateProviderMock(new Date())
    const blogBaseData = {
        title: 'test blog',
        body: 'test made for blog body',
        images: ['url-imagen1', 'url-imagen2'],
        tags: ['tag1', 'tag2'],
        category: 'category',
        trainer: 'Trainer name',
        date: date.current,
    } satisfies CreateBlogDTO
    const blogRepository = new BlogRepositoryMock()
    await new CreateBlogCommand(new IdGeneratorMock(), blogRepository).execute(
        blogBaseData,
    )
    lookFor(await blogRepository.getById(blogId)).toDeepEqual({
        id: blogId,
        title: 'test blog',
        body: 'test made for blog body',
        images: ['url-imagen1', 'url-imagen2'],
        tags: ['tag1', 'tag2'],
        category: 'category',
        trainer: 'Trainer name',
        date: date.current,
    })
}