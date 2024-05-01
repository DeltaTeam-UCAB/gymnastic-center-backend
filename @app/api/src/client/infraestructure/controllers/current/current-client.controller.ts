import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { Get, HttpException, SetMetadata, UseGuards } from '@nestjs/common'
import { User as UserDecorator } from '../../decorators/user.decorator'
import { UserGuard } from '../../guards/user.guard'
import { ApiHeader } from '@nestjs/swagger'
import { User } from 'src/user/infraestructure/models/postgres/user.entity'
import { Client } from '../../models/postgres/client.entity'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { RolesGuard } from '../../guards/roles.guard'

@Controller({
    path: 'client',
    docTitle: 'Client',
})
export class CurrentClientController
    implements ControllerContract<[user: User], Client>
{
    constructor(
        @InjectRepository(Client) private clientRepo: Repository<Client>,
    ) {}
    @Get('current')
    @SetMetadata('roles', ['CLIENT'])
    @UseGuards(UserGuard, RolesGuard)
    @ApiHeader({
        name: 'auth',
    })
    async execute(@UserDecorator() user: User): Promise<Client> {
        const possibleClient = await this.clientRepo.findOneBy({
            user,
        })
        if (!possibleClient)
            throw new HttpException(
                'Client additional information not registered',
                400,
            )
        return possibleClient
    }
}
