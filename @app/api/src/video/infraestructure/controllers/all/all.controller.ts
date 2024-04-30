import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { VIDEO_DOC_PREFIX, VIDEO_ROUTE_PREFIX } from '../prefix'
import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { Video } from '../../models/postgres/video'
import { Get, UseGuards } from '@nestjs/common'
import { ApiHeader } from '@nestjs/swagger'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserGuard } from 'src/user/infraestructure/guards/user.guard'
import { Roles, RolesGuard } from 'src/user/infraestructure/guards/roles.guard'

@Controller({
    path: VIDEO_ROUTE_PREFIX,
    docTitle: VIDEO_DOC_PREFIX,
})
export class FindVideoController
    implements ControllerContract<undefined, Video[]>
{
    constructor(
        @InjectRepository(Video) private videoRepo: Repository<Video>,
    ) {}
    @Get('all')
    @Roles('ADMIN')
    @ApiHeader({
        name: 'auth',
    })
    @UseGuards(UserGuard, RolesGuard)
    async execute(): Promise<Video[]> {
        return this.videoRepo.find()
    }
}
