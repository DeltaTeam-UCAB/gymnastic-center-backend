import { Result } from "../../../../../src/core/application/result-handler/result.handler"
import { IdGeneratorMock } from "./utils/id.generator.mock"
import { DateProviderMock } from '../../course/tests/utils/date.provider.mock'
import { BlogRepositoryMock } from "./utils/blog.repository.mock"
import { CreateBlogDTO } from "../../../../../src/blog/application/commands/create/types/dto"
import { createBlog } from './utils/blog.factory'
import { CreateBlogResponse } from "../../../../../src/blog/application/commands/create/types/response"
import { CreateBlogCommand } from "../../../../../src/blog/application/commands/create/create.blog.command"
import { BLOG_TITLE_EXIST } from "../../../../../src/blog/application/errors/blog.title.exists"

export const name = 'Should not create blog if title exist'
const date = new DateProviderMock(new Date())
export const body = async () => {
    const blogBaseData = {
        title: 'test blog',
        body: 'test made for blog body',
        images: ['url-imagen1', 'url-imagen2'],
        tags: ['tag1', 'tag2'],
        category: 'category',
        trainer: 'Trainer name',
        date: date.current,
    } satisfies CreateBlogDTO
    const blogRepository = new BlogRepositoryMock([
        createBlog({
            title: 'test blog',
        }),
    ])
    const result: Result<CreateBlogResponse> = await new CreateBlogCommand(
        new IdGeneratorMock(),
        blogRepository,
    ).execute(blogBaseData)
    result.handleError((e) => {
        lookFor(e.name).equals(BLOG_TITLE_EXIST)
    })
}