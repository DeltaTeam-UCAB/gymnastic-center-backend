import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { Get, UseGuards } from '@nestjs/common'
import { ApiHeader } from '@nestjs/swagger'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserGuard } from 'src/user/infraestructure/guards/user.guard'
import { Roles, RolesGuard } from 'src/user/infraestructure/guards/roles.guard'
import { IMAGE_DOC_PREFIX, IMAGE_ROUTE_PREFIX } from '../prefix'
import { Image } from '../../models/postgres/image'

@Controller({
    path: IMAGE_ROUTE_PREFIX,
    docTitle: IMAGE_DOC_PREFIX,
})
export class FindImageController
    implements ControllerContract<undefined, Image[]>
{
    constructor(
        @InjectRepository(Image) private imageRepo: Repository<Image>,
    ) {}
    @Get('all')
    @Roles('ADMIN')
    @ApiHeader({
        name: 'auth',
    })
    @UseGuards(UserGuard, RolesGuard)
    async execute(): Promise<Image[]> {
        return this.imageRepo.find()
    }
}
