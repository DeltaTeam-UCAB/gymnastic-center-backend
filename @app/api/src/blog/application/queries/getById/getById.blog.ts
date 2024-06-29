import { ApplicationService } from 'src/core/application/service/application.service'
import { GetBlogByIdDTO } from './types/dto'
import { GetBlogByIdResponse } from './types/response'
import { Result } from 'src/core/application/result-handler/result.handler'
import { isNotNull } from 'src/utils/null-manager/null-checker'
import { BlogRepository } from '../../repositories/blog.repository'
import { blogNotFoundError } from '../../errors/blog.not.found'
import { CategoryRepository } from '../../repositories/category.repository'
import { TrainerRepository } from '../../repositories/trainer.repository'
import { ImageRepository } from '../../repositories/image.repository'
import { BlogId } from 'src/blog/domain/value-objects/blog.id'

export class GetBlogByIdQuery
    implements ApplicationService<GetBlogByIdDTO, GetBlogByIdResponse>
{
    constructor(
        private blogRepository: BlogRepository,
        private categoryRepository: CategoryRepository,
        private trainerRepository: TrainerRepository,
        private imageRepository: ImageRepository,
    ) {}

    async execute(data: GetBlogByIdDTO): Promise<Result<GetBlogByIdResponse>> {
        const blog = await this.blogRepository.getById(new BlogId(data.id))
        if (!isNotNull(blog)) return Result.error(blogNotFoundError())
        return Result.success({
            id: blog.id.id,
            date: blog.date.date,
            tags: blog.tags.map((tag) => tag.tag),
            title: blog.title.title,
            description: blog.body.body,
            images: await blog.images.asyncMap(
                async (img) =>
                    (await this.imageRepository.getById(img.image))!.src,
            ),
            trainer: {
                id: blog.trainer.id.id,
                name: (await this.trainerRepository.getById(blog.trainer.id))!
                    .name.name,
            },
            category: (await this.categoryRepository.getById(blog.category.id))!
                .name.name,
        })
    }
}
