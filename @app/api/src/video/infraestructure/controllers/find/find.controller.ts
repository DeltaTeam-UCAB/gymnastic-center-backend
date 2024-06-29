import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { VIDEO_DOC_PREFIX, VIDEO_ROUTE_PREFIX } from '../prefix'
import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import {
    Get,
    HttpException,
    Param,
    ParseUUIDPipe,
    UseGuards,
} from '@nestjs/common'
import { UserGuard } from 'src/user/infraestructure/guards/user.guard'
import { GetVideoByIdResponse } from 'src/video/application/queries/get-by-id/types/response'
import { VideoPostgresRepository } from '../../repositories/postgres/video.repository'
import { ErrorDecorator } from 'src/core/application/decorators/error.handler.decorator'
import { GetVideoByIdQuery } from 'src/video/application/queries/get-by-id/get.video.id.query'

@Controller({
    path: VIDEO_ROUTE_PREFIX,
    docTitle: VIDEO_DOC_PREFIX,
    bearerAuth: true,
})
export class FindVideoController
implements ControllerContract<[id: string], GetVideoByIdResponse>
{
    constructor(private videoRepository: VideoPostgresRepository) {}
    @Get('one/:id')
    @UseGuards(UserGuard)
    async execute(
        @Param('id', ParseUUIDPipe) id: string,
    ): Promise<GetVideoByIdResponse> {
        const result = await new ErrorDecorator(
            new GetVideoByIdQuery(this.videoRepository),
            (e) => new HttpException(e.message, 404),
        ).execute({
            id,
        })
        return result.unwrap()
    }
}
