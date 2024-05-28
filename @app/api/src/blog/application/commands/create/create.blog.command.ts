import { ApplicationService } from 'src/core/application/service/application.service'
import { CreateBlogDTO } from './types/dto'
import { CreateBlogResponse } from './types/response'
import { Result } from 'src/core/application/result-handler/result.handler'
import { IDGenerator } from 'src/core/application/ID/ID.generator'
import { BlogRepository } from '../../repositories/blog.repository'
import { Blog } from '../../models/blog'
import { blogTitleExistError } from '../../errors/blog.title.exists'

export class CreateBlogCommand
implements ApplicationService<CreateBlogDTO, CreateBlogResponse>
{
    constructor(
        private idGenerator: IDGenerator<string>,
        private blogRepository: BlogRepository,
    ) {}
    async execute(data: CreateBlogDTO): Promise<Result<CreateBlogResponse>> {
        const isTitleExist = await this.blogRepository.existByTitle(data.title)
        if (isTitleExist) return Result.error(blogTitleExistError())
        const blogId = this.idGenerator.generate()
        const blog = {
            ...data,
            id: blogId,
        } satisfies Blog

        const result = await this.blogRepository.save(blog)
        if (result.isError()) return result.convertToOther()
        return Result.success({
            id: blogId,
        })
    }
}
