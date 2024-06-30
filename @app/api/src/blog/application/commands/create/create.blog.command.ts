import { ApplicationService } from 'src/core/application/service/application.service'
import { CreateBlogDTO } from './types/dto'
import { CreateBlogResponse } from './types/response'
import { Result } from 'src/core/application/result-handler/result.handler'
import { IDGenerator } from 'src/core/application/ID/ID.generator'
import { BlogRepository } from '../../repositories/blog.repository'
import { blogTitleExistError } from '../../errors/blog.title.exists'
import { Blog } from 'src/blog/domain/blog'
import { BlogId } from 'src/blog/domain/value-objects/blog.id'
import { BlogTitle } from 'src/blog/domain/value-objects/blog.title'
import { BlogBody } from 'src/blog/domain/value-objects/blog.body'
import { BlogImage } from 'src/blog/domain/value-objects/blog.images'
import { BlogTag } from 'src/blog/domain/value-objects/blog.tag'
import { BlogDate } from 'src/blog/domain/value-objects/blog.date'
import { TrainerRepository } from '../../repositories/trainer.repository'
import { CategoryRepository } from '../../repositories/category.repository'
import { TrainerId } from 'src/blog/domain/value-objects/trainer.id'
import { CategoryId } from 'src/blog/domain/value-objects/category.id'
import { trainerNotFoundError } from '../../errors/trainer.not.found'
import { categoryNotFoundError } from '../../errors/category.not.found'
import { DateProvider } from 'src/core/application/date/date.provider'

export class CreateBlogCommand
    implements ApplicationService<CreateBlogDTO, CreateBlogResponse>
{
    constructor(
        private idGenerator: IDGenerator<string>,
        private blogRepository: BlogRepository,
        private trainerRepository: TrainerRepository,
        private categoryRepository: CategoryRepository,
        private dateProvider: DateProvider,
    ) {}
    async execute(data: CreateBlogDTO): Promise<Result<CreateBlogResponse>> {
        const isBlogTitle = await this.blogRepository.existByTitle(
            new BlogTitle(data.title),
        )
        if (isBlogTitle) return Result.error(blogTitleExistError())

        const trainerId = new TrainerId(data.trainer)
        const trainerResult = await this.trainerRepository.getById(trainerId)
        if (!trainerResult) return Result.error(trainerNotFoundError())

        const categoryId = new CategoryId(data.category)
        const categoryResult = await this.categoryRepository.getById(categoryId)
        if (!categoryResult) return Result.error(categoryNotFoundError())

        const blogId = this.idGenerator.generate()
        const blog = new Blog(new BlogId(blogId), {
            title: new BlogTitle(data.title),
            body: new BlogBody(data.body),
            images: data.images.map((image) => new BlogImage(image)),
            tags: data.tags.map((tag) => new BlogTag(tag)),
            trainer: trainerResult,
            category: categoryResult,
            date: new BlogDate(this.dateProvider.current),
        })
        const result = await this.blogRepository.save(blog)
        if (result.isError()) return result.convertToOther()
        return Result.success({
            id: blogId,
        })
    }
}
