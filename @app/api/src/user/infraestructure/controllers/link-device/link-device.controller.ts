import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { LinkDeviceDTO } from './dto/dto'
import { Body, Inject, Put, UseGuards } from '@nestjs/common'
import { CurrentUserResponse } from 'src/user/application/queries/current/types/response'
import { DeviceLinker } from 'src/core/infraestructure/device-linker/device.linker'
import { User } from '../../decorators/user.decorator'
import { UserGuard } from '../../guards/user.guard'
import { REDIS_USER_LINKER } from 'src/core/infraestructure/device-linker/redis/redis.device.linker'

@Controller({
    path: 'user',
    docTitle: 'User',
    bearerAuth: true,
})
export class LinkDeviceController
    implements
        ControllerContract<
            [body: LinkDeviceDTO, user: CurrentUserResponse],
            void
        >
{
    constructor(
        @Inject(REDIS_USER_LINKER) private deviceLinker: DeviceLinker,
    ) {}
    @Put('link/device')
    @UseGuards(UserGuard)
    async execute(
        @Body() body: LinkDeviceDTO,
        @User() user: CurrentUserResponse,
    ): Promise<void> {
        await this.deviceLinker.link(user.id, body.token)
    }
}
