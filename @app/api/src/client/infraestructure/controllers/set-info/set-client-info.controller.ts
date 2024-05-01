import { Body, Inject, Post, SetMetadata, UseGuards } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { SetClientInfoDTO } from './dto/set.client.info.dto'
import { Client } from '../../models/postgres/client.entity'
import { Repository } from 'typeorm'
import { User as UserDecorator } from '../../decorators/user.decorator'
import { User } from 'src/user/infraestructure/models/postgres/user.entity'
import { IDGenerator } from 'src/core/application/ID/ID.generator'
import { UUID_GEN_NATIVE } from 'src/core/infraestructure/UUID/module/UUID.module'
import { RolesGuard } from '../../guards/roles.guard'
import { ApiHeader } from '@nestjs/swagger'
import { UserGuard } from '../../guards/user.guard'

@Controller({
    path: 'client',
    docTitle: 'Client',
})
export class SetClientInfoController
    implements
        ControllerContract<
            [user: User, body: SetClientInfoDTO],
            {
                message: string
            }
        >
{
    constructor(
        @Inject(UUID_GEN_NATIVE) private idGen: IDGenerator<string>,
        @InjectRepository(Client) private clientRepo: Repository<Client>,
    ) {}
    @Post('set-info')
    @SetMetadata('roles', ['CLIENT'])
    @UseGuards(UserGuard, RolesGuard)
    @ApiHeader({
        name: 'auth',
    })
    async execute(
        @UserDecorator() user: User,
        @Body() body: SetClientInfoDTO,
    ): Promise<{ message: string }> {
        const possibleClient = await this.clientRepo.findOneBy({
            user,
        })
        const clientId = possibleClient
            ? possibleClient.id
            : this.idGen.generate()
        const clientInfo = {
            id: clientId,
            user,
            ...body,
        }
        this.clientRepo.save(clientInfo)
        return {
            message: 'Succesfull',
        }
    }
}
