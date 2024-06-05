import { ApplicationService } from 'src/core/application/service/application.service'
import { CreateBlogDTO } from '../types/dto'
import { CreateBlogResponse } from '../types/response'
import { Result } from 'src/core/application/result-handler/result.handler'
import { BlogRepository } from 'src/blog/application/repositories/blog.repository'
import { blogTitleExistError } from 'src/blog/application/errors/blog.title.exists'

export class BlogTitleNotExistDecorator
    implements ApplicationService<CreateBlogDTO, CreateBlogResponse>
{
    constructor(
        private service: ApplicationService<CreateBlogDTO, CreateBlogResponse>,
        private blogRepository: BlogRepository,
    ) {}
    async execute(data: CreateBlogDTO): Promise<Result<CreateBlogResponse>> {
        const isTitleExist = await this.blogRepository.existByTitle(data.title)
        if (isTitleExist) return Result.error(blogTitleExistError())
        return this.service.execute(data)
    }
}
