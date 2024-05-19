import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { CreateCategoryDTO } from './dto/dto'
import { CreateCategoryResponse } from 'src/category/application/commands/create/types/reponse'
import {
    Body,
    HttpException,
    Inject,
    InternalServerErrorException,
    Post,
    UseGuards,
} from '@nestjs/common'
import { UUID_GEN_NATIVE } from 'src/core/infraestructure/UUID/module/UUID.module'
import { IDGenerator } from 'src/core/application/ID/ID.generator'
import { ImagePostgresRepository } from 'src/image/infraestructure/repositories/postgres/image.repository'
import { CategoryPostgresRepository } from '../../repositories/postgres/category.repository'
import { ErrorDecorator } from 'src/core/application/decorators/error.handler.decorator'
import { CreateCategoryCommand } from 'src/category/application/commands/create/create.category.command'
import { IMAGE_NOT_FOUND } from 'src/image/application/error/image.not.found'
import { CATEGORY_NAME_EXIST } from 'src/category/application/errors/category.name.exist'
import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { UserGuard } from 'src/user/infraestructure/guards/user.guard'
import { Roles, RolesGuard } from 'src/user/infraestructure/guards/roles.guard'
import { ApiHeader } from '@nestjs/swagger'

@Controller({
    path: 'category',
    docTitle: 'Category',
})
export class CreateCategoryController
implements
        ControllerContract<[body: CreateCategoryDTO], CreateCategoryResponse>
{
    constructor(
        @Inject(UUID_GEN_NATIVE) private idGen: IDGenerator<string>,
        private imageRepository: ImagePostgresRepository,
        private categoryRepository: CategoryPostgresRepository,
    ) {}
    @ApiHeader({
        name: 'auth',
    })
    @Post('create')
    @Roles('ADMIN')
    @UseGuards(UserGuard, RolesGuard)
    async execute(
        @Body() body: CreateCategoryDTO,
    ): Promise<CreateCategoryResponse> {
        const result = await new ErrorDecorator(
            new CreateCategoryCommand(
                this.idGen,
                this.categoryRepository,
                this.imageRepository,
            ),
            (e) => {
                if (e.name === IMAGE_NOT_FOUND)
                    return new HttpException(e.message, 404)
                if (e.name === CATEGORY_NAME_EXIST)
                    return new HttpException(e.message, 400)
                return new InternalServerErrorException()
            },
        ).execute(body)
        return result.unwrap()
    }
}