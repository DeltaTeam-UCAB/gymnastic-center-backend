import { DeleteBlogCommand } from '../../../../../src/blog/application/commands/delete/delete.blog.command'
import { BlogRepositoryMock } from './utils/blog.repository.mock'
import { DateProviderMock } from '../../blog/tests/utils/date.provider.mock'
import { createBlog } from './utils/blog.factory'
import { eventPublisherStub } from './utils/event.publisher.stup'
import { BlogId } from '../../../../../src/blog/domain/value-objects/blog.id'

export const name = 'Should delete blog'
export const body = async () => {
    const date = new DateProviderMock(new Date())
    const blogId = '84821c3f-0e66-4bf4-a3a8-520e42e50752'
    const blog = createBlog({
        id: blogId,
        title: 'test blog',
        body: 'test made for blog body',
        images: [],
        tags: [],
        category: 'fb7f0cf1-8525-4bce-8f91-3bf235046927',
        trainer: 'b54c7768-ce9e-470e-b18e-b51fb10829a7',
        date: date.current,
    })
    const blogRepository = new BlogRepositoryMock([blog])
    const result = await new DeleteBlogCommand(
        blogRepository,
        eventPublisherStub,
    ).execute({ id: blogId })
    const possibleBlog = await blogRepository.getById(new BlogId(blogId))
    lookFor(result.isError()).equals(false)
    lookFor(possibleBlog).toBeUndefined()
}
