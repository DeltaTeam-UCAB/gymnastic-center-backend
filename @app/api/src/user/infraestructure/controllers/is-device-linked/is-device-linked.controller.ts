import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import {
    Get,
    Inject,
    NotFoundException,
    Query,
    UseGuards,
} from '@nestjs/common'
import { CurrentUserResponse } from 'src/user/application/queries/current/types/response'
import { DeviceLinker } from 'src/core/infraestructure/device-linker/device.linker'
import { MONGO_USER_LINKER } from 'src/core/infraestructure/device-linker/mongo/mongo.device.linker.module'
import { User } from '../../decorators/user.decorator'
import { UserGuard } from '../../guards/user.guard'

@Controller({
    path: 'user',
    docTitle: 'User',
    bearerAuth: true,
})
export class IsDeviceLinkedController
implements
        ControllerContract<[token: string, user: CurrentUserResponse], void>
{
    constructor(
        @Inject(MONGO_USER_LINKER) private deviceLinker: DeviceLinker,
    ) {}
    @Get('is/device/linked')
    @UseGuards(UserGuard)
    async execute(
        @Query('token') token: string,
        @User() user: CurrentUserResponse,
    ): Promise<void> {
        const result = await this.deviceLinker.isLinked(user.id, token)
        if (!result) throw new NotFoundException()
    }
}
