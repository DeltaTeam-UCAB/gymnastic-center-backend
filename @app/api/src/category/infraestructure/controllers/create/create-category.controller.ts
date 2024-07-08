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
import { CategoryPostgresRepository } from '../../repositories/postgres/category.repository'
import { ErrorDecorator } from 'src/core/application/decorators/error.handler.decorator'
import { CreateCategoryCommand } from 'src/category/application/commands/create/create.category.command'
import { CATEGORY_NAME_EXIST } from 'src/category/application/errors/category.name.exist'
import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { UserGuard } from 'src/user/infraestructure/guards/user.guard'
import { Roles, RolesGuard } from 'src/user/infraestructure/guards/roles.guard'
import { ImagePostgresByCategoryRepository } from '../../repositories/postgres/image.postgres.repository'
import { NestLogger } from 'src/core/infraestructure/logger/nest.logger'
import { LoggerDecorator } from 'src/core/application/decorators/logger.decorator'
import { CurrentUserResponse } from 'src/user/application/queries/current/types/response'
import { User as UserDecorator } from 'src/user/infraestructure/decorators/user.decorator'
import { AuditingTxtRepository } from 'src/core/infraestructure/auditing/repositories/txt/auditing.repository'
import { AuditDecorator } from 'src/core/application/decorators/audit.decorator'
import { IMAGE_NOT_FOUND } from 'src/category/application/errors/image.not.found'

@Controller({
    path: 'category',
    docTitle: 'Category',
    bearerAuth: true,
})
export class CreateCategoryController
    implements
        ControllerContract<
            [body: CreateCategoryDTO, user: CurrentUserResponse],
            CreateCategoryResponse
        >
{
    constructor(
        @Inject(UUID_GEN_NATIVE) private idGen: IDGenerator<string>,
        private imageRepository: ImagePostgresByCategoryRepository,
        private categoryRepository: CategoryPostgresRepository,
    ) {}
    @Post('create')
    @Roles('ADMIN')
    @UseGuards(UserGuard, RolesGuard)
    async execute(
        @Body() body: CreateCategoryDTO,
        @UserDecorator() user: CurrentUserResponse,
    ): Promise<CreateCategoryResponse> {
        const audit = {
            user: user.id,
            operation: 'Create Category',
            succes: true,
            ocurredOn: new Date(Date.now()),
            data: JSON.stringify(body),
        }
        const nestLogger = new NestLogger('Create Category logger')

        const result = await new ErrorDecorator(
            new AuditDecorator(
                new LoggerDecorator(
                    new CreateCategoryCommand(
                        this.idGen,
                        this.categoryRepository,
                        this.imageRepository,
                    ),
                    nestLogger,
                ),
                new AuditingTxtRepository(),
                audit,
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
