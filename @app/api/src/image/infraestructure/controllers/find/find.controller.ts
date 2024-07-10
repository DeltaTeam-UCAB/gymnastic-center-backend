import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import {
    Get,
    HttpException,
    Param,
    ParseUUIDPipe,
    UseGuards,
} from '@nestjs/common'
import { UserGuard } from '../../guards/user.guard'
import { IMAGE_DOC_PREFIX, IMAGE_ROUTE_PREFIX } from '../prefix'
import { GetImageByIdResponse } from 'src/image/application/queries/get-by-id/types/response'
import { GetImageByIdQuery } from 'src/image/application/queries/get-by-id/get.image.id.query'
import { ErrorDecorator } from 'src/core/application/decorators/error.handler.decorator'
import { ImagePostgresRepository } from '../../repositories/postgres/image.repository'
import { NestLogger } from 'src/core/infraestructure/logger/nest.logger'
import { LoggerDecorator } from 'src/core/application/decorators/logger.decorator'

@Controller({
    path: IMAGE_ROUTE_PREFIX,
    docTitle: IMAGE_DOC_PREFIX,
    bearerAuth: true,
})
export class FindImageController
    implements ControllerContract<[id: string], GetImageByIdResponse>
{
    constructor(private imageRepository: ImagePostgresRepository) {}
    @Get('one/:id')
    @UseGuards(UserGuard)
    async execute(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<GetImageByIdResponse> {
        const nestLogger = new NestLogger('Find image logger')
        const service = new ErrorDecorator(
            new LoggerDecorator(
                new GetImageByIdQuery(this.imageRepository),
                nestLogger,
            ),
            (e) => new HttpException(e.message, 404),
        )
        const result = await service.execute({
            id,
        })
        return result.unwrap()
    }
}
