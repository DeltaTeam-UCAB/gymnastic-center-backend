import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { VIDEO_DOC_PREFIX, VIDEO_ROUTE_PREFIX } from '../prefix'
import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { Video } from '../../models/postgres/video'
import {
    Get,
    NotFoundException,
    Param,
    ParseUUIDPipe,
    UseGuards,
} from '@nestjs/common'
import { ApiHeader } from '@nestjs/swagger'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserGuard } from 'src/user/infraestructure/guards/user.guard'

@Controller({
    path: VIDEO_ROUTE_PREFIX,
    docTitle: VIDEO_DOC_PREFIX,
})
export class FindVideoController
    implements ControllerContract<[id: string], Video>
{
    constructor(
        @InjectRepository(Video) private videoRepo: Repository<Video>,
    ) {}
    @Get('one/:id')
    @ApiHeader({
        name: 'auth',
    })
    @UseGuards(UserGuard)
    async execute(@Param('id', ParseUUIDPipe) id: string): Promise<Video> {
        const video = await this.videoRepo.findOneBy({
            id,
        })
        if (!video) throw new NotFoundException()
        return video
    }
}
