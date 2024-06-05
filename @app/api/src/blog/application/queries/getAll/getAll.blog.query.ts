import { ApplicationService } from 'src/core/application/service/application.service'
import { GetAllBlogResponse } from './types/response'
import { Result } from 'src/core/application/result-handler/result.handler'
import { BlogRepository } from '../../repositories/blog.repository'
import { GetAllBlogsDTO } from './types/dto'
import { CategoryRepository } from '../../repositories/category.repository'
import { TrainerRepository } from '../../repositories/trainer.repository'
import { ImageRepository } from '../../repositories/image.repository'

export class GetAllBlogQuery
    implements ApplicationService<GetAllBlogsDTO, GetAllBlogResponse[]>
{
    constructor(
        private blogRepository: BlogRepository,
        private categoryRepository: CategoryRepository,
        private trainerRepository: TrainerRepository,
        private imageRepository: ImageRepository,
    ) {}
    async execute(data: GetAllBlogsDTO): Promise<Result<GetAllBlogResponse[]>> {
        const blogs = await this.blogRepository.getAll(data)
        return Result.success(
            await blogs.asyncMap(async (blog) => ({
                id: blog.id,
                description: blog.body,
                category: (await this.categoryRepository.getById(
                    blog.category,
                ))!.name,
                date: blog.date,
                images: await blog.images.asyncMap(
                    async (img) =>
                        (await this.imageRepository.getById(img))!.src,
                ),
                tags: blog.tags,
                title: blog.title,
                trainer: (await this.trainerRepository.getById(blog.trainer))!
                    .name,
            })),
        )
    }
}
