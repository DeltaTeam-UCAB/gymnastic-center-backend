import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import {
    Get,
    HttpException,
    Param,
    ParseUUIDPipe,
    UseGuards,
} from '@nestjs/common'
import { ApiHeader } from '@nestjs/swagger'
import { UserGuard } from 'src/user/infraestructure/guards/user.guard'
import { IMAGE_DOC_PREFIX, IMAGE_ROUTE_PREFIX } from '../prefix'
import { GetImageByIdResponse } from 'src/image/application/queries/get-by-id/types/response'
import { GetImageByIdQuery } from 'src/image/application/queries/get-by-id/get.image.id.query'
import { ErrorDecorator } from 'src/core/application/decorators/error.handler.decorator'
import { ImagePostgresRepository } from '../../repositories/postgres/image.repository'

@Controller({
    path: IMAGE_ROUTE_PREFIX,
    docTitle: IMAGE_DOC_PREFIX,
})
export class FindImageController
implements ControllerContract<[id: string], GetImageByIdResponse>
{
    constructor(private imageRepository: ImagePostgresRepository) {}
    @Get('one/:id')
    @ApiHeader({
        name: 'auth',
    })
    @UseGuards(UserGuard)
    async execute(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<GetImageByIdResponse> {
        const result = await new ErrorDecorator(
            new GetImageByIdQuery(this.imageRepository),
            (e) => new HttpException(e.message, 404),
        ).execute({
            id,
        })
        return result.unwrap()
    }
}
