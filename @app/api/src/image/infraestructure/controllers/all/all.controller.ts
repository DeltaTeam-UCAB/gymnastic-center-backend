import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { Get, UseGuards } from '@nestjs/common'
import { ApiHeader } from '@nestjs/swagger'
import { UserGuard } from 'src/user/infraestructure/guards/user.guard'
import { Roles, RolesGuard } from 'src/user/infraestructure/guards/roles.guard'
import { IMAGE_DOC_PREFIX, IMAGE_ROUTE_PREFIX } from '../prefix'
import { GetAllImagesQuery } from 'src/image/application/queries/get-all/get.all.image.query'
import { GetAllImagesResponse } from 'src/image/application/queries/get-all/types/response'
import { ImagePostgresRepository } from '../../repositories/postgres/image.repository'
import { NestLogger } from 'src/core/infraestructure/logger/nest.logger'
import { LoggerDecorator } from 'src/core/application/decorators/logger.decorator'

@Controller({
    path: IMAGE_ROUTE_PREFIX,
    docTitle: IMAGE_DOC_PREFIX,
})
export class FindImageController
    implements ControllerContract<undefined, GetAllImagesResponse>
{
    constructor(private imageRepository: ImagePostgresRepository) {}
    @Get('all')
    @Roles('ADMIN')
    @ApiHeader({
        name: 'auth',
    })
    @UseGuards(UserGuard, RolesGuard)
    async execute(): Promise<GetAllImagesResponse> {
        const nestLogger = new NestLogger('Find all images logger')
        const service = new LoggerDecorator(
            await new GetAllImagesQuery(this.imageRepository),
            nestLogger,
        )

        const result = await service.execute({})
        return result.unwrap()
    }
}
