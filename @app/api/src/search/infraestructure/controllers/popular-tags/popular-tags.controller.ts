import { Get, ParseIntPipe, Query, UseGuards } from '@nestjs/common'
import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { GetPopularTagsResponse } from 'src/search/application/queries/popular-tags/types/response'
import { TagPostgresRepository } from '../../repositories/postgres/tag.repository'
import { GetPopularTagsQuery } from 'src/search/application/queries/popular-tags/popular.tags.query'
import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { ApiHeader } from '@nestjs/swagger'
import { UserGuard } from 'src/user/infraestructure/guards/user.guard'

@Controller({
    path: 'search',
    docTitle: 'Search',
})
export class GetPopularTagsControllers
    implements
        ControllerContract<
            [page: number, perPage: number],
            GetPopularTagsResponse
        >
{
    constructor(private tagProvider: TagPostgresRepository) {}
    @Get('popular/tags')
    @ApiHeader({
        name: 'auth',
    })
    @UseGuards(UserGuard)
    async execute(
        @Query('page', ParseIntPipe) page: number,
        @Query('perPage', ParseIntPipe) perPage: number,
    ): Promise<GetPopularTagsResponse> {
        const resp = await new GetPopularTagsQuery(this.tagProvider).execute({
            page,
            perPage,
        })
        return resp.unwrap()
    }
}
