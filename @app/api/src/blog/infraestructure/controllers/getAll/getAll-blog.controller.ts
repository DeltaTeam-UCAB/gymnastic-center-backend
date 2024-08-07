import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { Get, Query, UseGuards } from '@nestjs/common'
import { UserGuard } from '../../guards/user.guard'
import { BLOG_DOC_PREFIX, BLOG_ROUTE_PREFIX } from '../prefix'
import { GetAllBlogResponse } from 'src/blog/application/queries/getAll/types/response'
import { BlogPostgresRepository } from '../../repositories/postgres/blog.repository'
import { GetAllBlogQuery } from 'src/blog/application/queries/getAll/getAll.blog.query'
import { CategoryByBlogPostgresRepository } from '../../repositories/postgres/category.repository'
import { TrainerByBlogPostgresRepository } from '../../repositories/postgres/trainer.repository'
import { ImageByBlogPostgresRepository } from '../../repositories/postgres/image.repository'
import { GetAllBlogsDTO } from './dto/getAll.blogs.dto'
import { NestLogger } from 'src/core/infraestructure/logger/nest.logger'
import { LoggerDecorator } from 'src/core/application/decorators/logger.decorator'
import { CategoryRedisRepositoryProxy } from '../../repositories/redis/category.repository.proxy'
import { TrainerRedisRepositoryProxy } from '../../repositories/redis/trainer.repository.proxy'
import { ImageRedisRepositoryProxy } from '../../repositories/redis/image.repository.proxy'

@Controller({
    path: BLOG_ROUTE_PREFIX,
    docTitle: BLOG_DOC_PREFIX,
    bearerAuth: true,
})
export class GetAllBlogController
    implements
        ControllerContract<[query: GetAllBlogsDTO], GetAllBlogResponse[]>
{
    constructor(
        private blogRepository: BlogPostgresRepository,
        private categoryRepository: CategoryByBlogPostgresRepository,
        private trainerRepository: TrainerByBlogPostgresRepository,
        private imageRepository: ImageByBlogPostgresRepository,
    ) {}

    @Get('many')
    @UseGuards(UserGuard)
    async execute(
        @Query() query: GetAllBlogsDTO,
    ): Promise<GetAllBlogResponse[]> {
        const nestLogger = new NestLogger('Get all Blog logger')
        const result = await new LoggerDecorator(
            new GetAllBlogQuery(
                this.blogRepository,
                new CategoryRedisRepositoryProxy(this.categoryRepository),
                new TrainerRedisRepositoryProxy(this.trainerRepository),
                new ImageRedisRepositoryProxy(this.imageRepository),
            ),
            nestLogger,
        ).execute({
            page: query.page,
            perPage: query.perPage,
            filter: query.filter,
            category: query.category,
            trainer: query.trainer,
        })
        return result.unwrap()
    }
}
