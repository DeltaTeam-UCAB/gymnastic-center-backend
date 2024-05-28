import { ApplicationService } from 'src/core/application/service/application.service'
import { GetBlogByIdDTO } from './types/dto'
import { GetBlogByIdResponse } from './types/response'
import { Result } from 'src/core/application/result-handler/result.handler'
import { isNotNull } from 'src/utils/null-manager/null-checker'
import { BlogRepository } from '../../repositories/blog.repository'
import { blogNotFoundError } from '../../errors/blog.not.found'

export class GetBlogByIdQuery
    implements ApplicationService<GetBlogByIdDTO, GetBlogByIdResponse>
{
    constructor(private blogRepository: BlogRepository) {}
    async execute(data: GetBlogByIdDTO): Promise<Result<GetBlogByIdResponse>> {
        const blog = await this.blogRepository.getById(data.id)
        if (!isNotNull(blog)) return Result.error(blogNotFoundError())
        return Result.success(blog)
    }
}
