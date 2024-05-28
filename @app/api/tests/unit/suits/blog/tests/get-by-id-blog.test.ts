import { Result } from '../../../../../src/core/application/result-handler/result.handler'
import { createBlog } from './utils/blog.factory'
import { BlogRepositoryMock } from './utils/blog.repository.mock'
import { GetBlogByIdResponse } from '../../../../../src/blog/application/queries/getById/types/response'
import { GetBlogByIdQuery } from '../../../../../src/blog/application/queries/getById/getById.blog'


export const name = 'Should get blog by ID'
export const body = async () => {
    const blog = createBlog()
    const blogRepository = new BlogRepositoryMock([blog])
    const result: Result<GetBlogByIdResponse> = await new GetBlogByIdQuery(
        blogRepository,
    ).execute({
        id: blog.id,
    })
    lookFor(result.unwrap()).toDeepEqual({
        id: blog.id,
        title: blog.title,
        body: blog.body,
        category: blog.category,
        tags: blog.tags,
        images: blog.images,
        trainer: blog.trainer,
        date: blog.date,
    })
}