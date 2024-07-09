import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { CurrentUserResponse } from 'src/user/application/queries/current/types/response'
import { Delete, Query, UseGuards } from '@nestjs/common'
import { UserGuard } from 'src/user/infraestructure/guards/user.guard'
import { Roles, RolesGuard } from 'src/user/infraestructure/guards/roles.guard'
import { User } from 'src/user/infraestructure/decorators/user.decorator'
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
    @Delete('token')
    @Roles('CLIENT')
    @UseGuards(UserGuard, RolesGuard)
    async execute(
        @User() user: CurrentUserResponse,
        @Query() data: RemoveTokenDTO,
    ): Promise<void> {
        await redisClient
            .sRem('notification-token:' + user.id, data.token)
            .catch((e) => console.log(e))
    }
}
