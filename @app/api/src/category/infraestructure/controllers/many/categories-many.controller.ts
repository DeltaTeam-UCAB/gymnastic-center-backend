import { Get, ParseIntPipe, Query, UseGuards } from '@nestjs/common'
import { GetCategoriesManyResponse } from 'src/category/application/queries/many/types/response'
import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { UserGuard } from '../../guards/user.guard'
import { CategoryPostgresRepository } from '../../repositories/postgres/category.repository'
import { ImagePostgresByCategoryRepository } from '../../repositories/postgres/image.postgres.repository'
import { GetCategoriesManyQuery } from 'src/category/application/queries/many/category.many.query'
import { ImageRedisRepositoryProxy } from '../../repositories/redis/image.repository.proxy'

@Controller({
    path: 'category',
    docTitle: 'Category',
    bearerAuth: true,
})
export class GetCategoriesManyController
implements
        ControllerContract<
            [page: number, perPage: number],
            GetCategoriesManyResponse
        >
{
    constructor(
        private categoryRepository: CategoryPostgresRepository,
        private imageRepository: ImagePostgresByCategoryRepository,
    ) {}

    @Get('many')
    @UseGuards(UserGuard)
    async execute(
        @Query('page', ParseIntPipe) page: number,
        @Query('perPage', ParseIntPipe) perPage: number,
    ): Promise<GetCategoriesManyResponse> {
        const result = await new GetCategoriesManyQuery(
            this.categoryRepository,
            new ImageRedisRepositoryProxy(this.imageRepository),
        ).execute({
            page,
            perPage,
        })
        return result.unwrap()
    }
}
