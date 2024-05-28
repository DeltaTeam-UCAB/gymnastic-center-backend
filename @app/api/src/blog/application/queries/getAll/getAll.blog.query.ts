import { ApplicationService } from 'src/core/application/service/application.service'
import { GetAllBlogResponse } from './types/response'
import { Result } from 'src/core/application/result-handler/result.handler'
import { BlogRepository } from '../../repositories/blog.repository'
import { BlogPaginationDTO } from './types/dto'

export class GetAllBlogQuery
implements ApplicationService<BlogPaginationDTO, GetAllBlogResponse[]>
{
    constructor(private blogRepository: BlogRepository) {}
    async execute(
        data: BlogPaginationDTO,
    ): Promise<Result<GetAllBlogResponse[]>> {
        const blogs = await this.blogRepository.getAll(data.limit, data.offset)
        return Result.success(blogs)
    }
}
