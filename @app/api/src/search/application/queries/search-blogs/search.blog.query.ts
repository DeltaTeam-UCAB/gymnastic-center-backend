import { ApplicationService } from 'src/core/application/service/application.service'
import { GetAllBlogResponse } from './types/response'
import { Result } from 'src/core/application/result-handler/result.handler'
import { BlogRepository } from '../../repositories/blog.repository'
import { GetAllBlogsDTO } from './types/dto'
import { ImageRepository } from '../../repositories/image.repository'

export class SearchBlogsQuery
implements ApplicationService<GetAllBlogsDTO, GetAllBlogResponse[]>
{
    constructor(
        private blogRepository: BlogRepository,
        private imageRepository: ImageRepository,
    ) {}
    async execute(data: GetAllBlogsDTO): Promise<Result<GetAllBlogResponse[]>> {
        const blogs = await this.blogRepository.getMany(data)
        return Result.success(
            await blogs.asyncMap(async (blog) => ({
                id: blog.id,
                category: blog.category,
                date: blog.date,
                image: (await this.imageRepository.getById(blog.image))!.src,
                title: blog.title,
                trainer: blog.trainer,
            })),
        )
    }
}
