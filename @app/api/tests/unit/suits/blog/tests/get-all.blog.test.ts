import { Result } from '../../../../../src/core/application/result-handler/result.handler'
import { createBlog } from './utils/blog.factory'
import { BlogRepositoryMock } from './utils/blog.repository.mock'
import { GetAllBlogResponse } from '../../../../../src/blog/application/queries/getAll/types/response'
import { GetAllBlogQuery } from '../../../../../src/blog/application/queries/getAll/getAll.blog.query'

export const name = 'Should get all blogs'
export const body = async () => {
    const blog = createBlog()
    const blogRepository = new BlogRepositoryMock([blog])
    const result: Result<GetAllBlogResponse[]> = await new GetAllBlogQuery(
        blogRepository,
    ).execute({ limit: 10, offset: 0 })
    lookFor(result.unwrap()).toDeepEqual([
        {
            id: blog.id,
            title: blog.title,
            body: blog.body,
            category: blog.category,
            tags: blog.tags,
            images: blog.images,
            trainer: blog.trainer,
            date: blog.date,
        },
    ])
}