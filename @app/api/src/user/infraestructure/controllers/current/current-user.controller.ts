import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { Get, UseGuards } from '@nestjs/common'
import { User as UserDecorator } from '../../decorators/user.decorator'
import { UserGuard } from '../../guards/user.guard'
import { CurrentUserResponse } from 'src/user/application/queries/current/types/response'

@Controller({
    path: 'auth',
    docTitle: 'Auth',
    bearerAuth: true,
})
export class CurrentUserController
implements
        ControllerContract<[user: CurrentUserResponse], CurrentUserResponse>
{
    @Get('current')
    @UseGuards(UserGuard)
    async execute(
        @UserDecorator() user: CurrentUserResponse,
    ): Promise<CurrentUserResponse> {
        return user
    }
}
