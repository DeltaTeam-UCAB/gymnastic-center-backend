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

@Controller({
    path: BLOG_ROUTE_PREFIX,
    docTitle: BLOG_DOC_PREFIX,
})
export class GetAllBlogController
    implements
        ControllerContract<
            [limit: number, offset: number],
            GetAllBlogResponse[]
        >
{
    constructor(
        private blogRepository: BlogPostgresRepository,
        private categoryRepository: CategoryByBlogPostgresRepository,
        private trainerRepository: TrainerByBlogPostgresRepository,
        private imageRepository: ImageByBlogPostgresRepository,
    ) {}

    @Get('getAll')
    @UseGuards(UserGuard)
    @ApiHeader({
        name: 'auth',
    })
    async execute(
        @Query('limit') limit: number,
        @Query('offset') offset: number,
    ): Promise<GetAllBlogResponse[]> {
        const result = await new GetAllBlogQuery(
            this.blogRepository,
            this.categoryRepository,
            this.trainerRepository,
            this.imageRepository,
        ).execute({
            limit,
            offset,
        })
        return result.unwrap()
    }
}
