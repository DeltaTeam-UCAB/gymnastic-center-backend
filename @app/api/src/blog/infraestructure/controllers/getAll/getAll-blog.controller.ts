import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { Get, Query, UseGuards } from '@nestjs/common'
import { UserGuard } from 'src/user/infraestructure/guards/user.guard'
import { ApiHeader } from '@nestjs/swagger'
import { BLOG_DOC_PREFIX, BLOG_ROUTE_PREFIX } from '../prefix'
import { GetAllBlogResponse } from 'src/blog/application/queries/getAll/types/response'
import { BlogPostgresRepository } from '../../repositories/postgres/blog.repository'
import { GetAllBlogQuery } from 'src/blog/application/queries/getAll/getAll.blog.query'

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
    constructor(private blogRepository: BlogPostgresRepository) {}

    @Get('getAll')
    @UseGuards(UserGuard)
    @ApiHeader({
        name: 'auth',
    })
    async execute(
        @Query('limit') limit: number,
        @Query('offset') offset: number,
    ): Promise<GetAllBlogResponse[]> {
        const result = await new GetAllBlogQuery(this.blogRepository).execute({
            limit,
            offset,
        })
        return result.unwrap()
    }
}
