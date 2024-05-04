import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { Get, UseGuards } from '@nestjs/common'
import { ApiHeader } from '@nestjs/swagger'
import { Client } from '../../models/postgres/client.entity'
import { Roles, RolesGuard } from '../../guards/roles.guard'
import { Client as ClientDecorator } from '../../decorators/client.decorator'
import { ClientGuard } from '../../guards/client.guard'
import { UserGuard } from '../../guards/user.guard'

@Controller({
    path: 'client',
    docTitle: 'Client',
})
export class CurrentClientController
    implements ControllerContract<[client: Client], Client>
{
    @Get('current')
    @Roles('CLIENT')
    @UseGuards(UserGuard, RolesGuard, ClientGuard)
    @ApiHeader({
        name: 'auth',
    })
    async execute(@ClientDecorator() client: Client): Promise<Client> {
        return client
    }
}
