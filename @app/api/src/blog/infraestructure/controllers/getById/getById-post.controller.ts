import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { Get, Param, ParseUUIDPipe, UseGuards } from '@nestjs/common'
import { UserGuard } from 'src/user/infraestructure/guards/user.guard'
import { ApiHeader } from '@nestjs/swagger'
import { BLOG_DOC_PREFIX, BLOG_ROUTE_PREFIX } from '../prefix'
import { BlogPostgresRepository } from '../../repositories/postgres/blog.repository'
import { GetBlogByIdResponse } from 'src/blog/application/queries/getById/types/response'
import { GetBlogByIdQuery } from 'src/blog/application/queries/getById/getById.blog'

@Controller({
    path: BLOG_ROUTE_PREFIX,
    docTitle: BLOG_DOC_PREFIX,
})
export class GetPostByIdController
implements ControllerContract<[id: string], GetBlogByIdResponse>
{
    constructor(private blogRepository: BlogPostgresRepository) {}

    @Get('getById/:id')
    @UseGuards(UserGuard)
    @ApiHeader({
        name: 'auth',
    })
    async execute(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<GetBlogByIdResponse> {
        const result = await new GetBlogByIdQuery(this.blogRepository).execute({
            id,
        })
        return result.unwrap()
    }
}
