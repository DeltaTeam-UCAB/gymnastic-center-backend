import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { User } from '../../models/postgres/user.entity'
import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { Get, UseGuards } from '@nestjs/common'
import { User as UserDecorator } from '../../decorators/user.decorator'
import { UserGuard } from '../../guards/user.guard'
import { ApiHeader } from '@nestjs/swagger'

@Controller({
    path: 'user',
    docTitle: 'User',
})
export class CurrentUserController
    implements ControllerContract<[user: User], User>
{
    @Get('current')
    @UseGuards(UserGuard)
    @ApiHeader({
        name: 'auth',
    })
    async execute(@UserDecorator() user: User): Promise<User> {
        return {
            ...user,
            password: '',
        }
    }
}
