import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { VIDEO_DOC_PREFIX, VIDEO_ROUTE_PREFIX } from '../prefix'
import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { Get, UseGuards } from '@nestjs/common'
import { GetAllVideosResponse } from 'src/video/application/queries/get-all/types/response'
import { VideoPostgresRepository } from '../../repositories/postgres/video.repository'
import { GetAllVideosQuery } from 'src/video/application/queries/get-all/get.all.video.query'
import { Roles, RolesGuard } from '../../guards/roles.guard'
import { UserGuard } from '../../guards/user.guard'

@Controller({
    path: VIDEO_ROUTE_PREFIX,
    docTitle: VIDEO_DOC_PREFIX,
    bearerAuth: true,
})
export class FindVideoController
    implements ControllerContract<undefined, GetAllVideosResponse>
{
    constructor(private videoRepository: VideoPostgresRepository) {}
    @Get('all')
    @Roles('ADMIN')
    @UseGuards(UserGuard, RolesGuard)
    async execute(): Promise<GetAllVideosResponse> {
        const result = await new GetAllVideosQuery(
            this.videoRepository,
        ).execute()
        return result.unwrap()
    }
}
