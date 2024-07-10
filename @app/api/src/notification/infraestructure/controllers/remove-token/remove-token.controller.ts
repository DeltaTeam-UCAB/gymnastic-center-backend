import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { CurrentUserResponse } from '../../auth/current/types/response'
import { Body, Post, UseGuards } from '@nestjs/common'
import { UserGuard } from '../../guards/user.guard'
import { Roles, RolesGuard } from '../../guards/roles.guard'
import { User } from '../../decorators/user.decorator'
import { RemoveTokenDTO } from './dto/dto'
import { redisClient } from 'src/core/infraestructure/cache/redis/redis.client'

@Controller({
    path: 'notifications',
    docTitle: 'Notification',
    bearerAuth: true,
})
export class RemoveTokenController
    implements
        ControllerContract<
            [user: CurrentUserResponse, body: RemoveTokenDTO],
            void
        >
{
    @Post('removetoken')
    @Roles('CLIENT')
    @UseGuards(UserGuard, RolesGuard)
    async execute(
        @User() user: CurrentUserResponse,
        @Body() data: RemoveTokenDTO,
    ): Promise<void> {
        await redisClient
            .sRem('notification-token:' + user.id, data.token)
            .catch((e) => console.log(e))
    }
}
