import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { CurrentUserResponse } from '../../auth/current/types/response'
import { Body, Post, UseGuards } from '@nestjs/common'
import { UserGuard } from '../../guards/user.guard'
import { Roles, RolesGuard } from '../../guards/roles.guard'
import { User } from '../../decorators/user.decorator'
import { AddTokenDTO } from './dto/dto'
import { redisClient } from 'src/core/infraestructure/cache/redis/redis.client'

@Controller({
    path: 'notifications',
    docTitle: 'Notification',
    bearerAuth: true,
})
export class AddTokenController
implements
        ControllerContract<
            [user: CurrentUserResponse, body: AddTokenDTO],
            void
        >
{
    @Post('savetoken')
    @Roles('CLIENT')
    @UseGuards(UserGuard, RolesGuard)
    async execute(
        @User() user: CurrentUserResponse,
        @Body() body: AddTokenDTO,
    ): Promise<void> {
        const tokens = await redisClient.sMembers(
            'notification-token:' + user.id,
        )
        if (!tokens.includes(body.token))
            await redisClient.sAdd('notification-token:' + user.id, body.token)
    }
}
