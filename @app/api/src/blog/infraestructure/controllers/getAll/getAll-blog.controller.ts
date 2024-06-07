import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { Get, Query, UseGuards } from '@nestjs/common'
import { UserGuard } from 'src/user/infraestructure/guards/user.guard'
import { ApiHeader } from '@nestjs/swagger'
import { BLOG_DOC_PREFIX, BLOG_ROUTE_PREFIX } from '../prefix'
import { GetAllBlogResponse } from 'src/blog/application/queries/getAll/types/response'
import { BlogPostgresRepository } from '../../repositories/postgres/blog.repository'
import { GetAllBlogQuery } from 'src/blog/application/queries/getAll/getAll.blog.query'
import { CategoryByBlogPostgresRepository } from '../../repositories/postgres/category.repository'
import { TrainerByBlogPostgresRepository } from '../../repositories/postgres/trainer.repository'
import { ImageByBlogPostgresRepository } from '../../repositories/postgres/image.repository'
import { GetAllBlogsDTO } from './dto/getAll.blogs.dto'

@Controller({
    path: BLOG_ROUTE_PREFIX,
    docTitle: BLOG_DOC_PREFIX,
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
    @ApiHeader({
        name: 'auth',
    })
    async execute(
        @Query() query: GetAllBlogsDTO,
    ): Promise<GetAllBlogResponse[]> {
        const result = await new GetAllBlogQuery(
            this.blogRepository,
            this.categoryRepository,
            this.trainerRepository,
            this.imageRepository,
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
