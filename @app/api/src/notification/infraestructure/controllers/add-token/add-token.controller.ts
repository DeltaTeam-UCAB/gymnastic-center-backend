import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { CurrentUserResponse } from 'src/user/application/queries/current/types/response'
import { Body, Post, UseGuards } from '@nestjs/common'
import { UserGuard } from 'src/user/infraestructure/guards/user.guard'
import { Roles, RolesGuard } from 'src/user/infraestructure/guards/roles.guard'
import { User } from 'src/user/infraestructure/decorators/user.decorator'
import { AddTokenDTO } from './dto/dto'
import { addToken } from '../../firebase/token.storage'

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
        addToken(user.id, body.token)
    }
}
