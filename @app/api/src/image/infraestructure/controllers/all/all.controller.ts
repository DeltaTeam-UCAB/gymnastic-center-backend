import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { Get, UseGuards } from '@nestjs/common'
import { UserGuard } from '../../guards/user.guard'
import { Roles, RolesGuard } from '../../guards/roles.guard'
import { IMAGE_DOC_PREFIX, IMAGE_ROUTE_PREFIX } from '../prefix'
import { GetAllImagesQuery } from 'src/image/application/queries/get-all/get.all.image.query'
import { GetAllImagesResponse } from 'src/image/application/queries/get-all/types/response'
import { ImagePostgresRepository } from '../../repositories/postgres/image.repository'
import { NestLogger } from 'src/core/infraestructure/logger/nest.logger'
import { LoggerDecorator } from 'src/core/application/decorators/logger.decorator'

@Controller({
    path: IMAGE_ROUTE_PREFIX,
    docTitle: IMAGE_DOC_PREFIX,
    bearerAuth: true,
})
export class FindImageController
implements ControllerContract<undefined, GetAllImagesResponse>
{
    constructor(private imageRepository: ImagePostgresRepository) {}
    @Get('all')
    @Roles('ADMIN')
    @UseGuards(UserGuard, RolesGuard)
    async execute(): Promise<GetAllImagesResponse> {
        const nestLogger = new NestLogger('Find all images logger')
        const service = new LoggerDecorator(
            new GetAllImagesQuery(this.imageRepository),
            nestLogger,
        )

        const result = await service.execute({})
        return result.unwrap()
    }
}
