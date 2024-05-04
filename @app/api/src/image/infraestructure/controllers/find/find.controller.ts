import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import {
    Get,
    NotFoundException,
    Param,
    ParseUUIDPipe,
    UseGuards,
} from '@nestjs/common'
import { ApiHeader } from '@nestjs/swagger'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { UserGuard } from 'src/user/infraestructure/guards/user.guard'
import { Image } from '../../models/postgres/image'
import { IMAGE_DOC_PREFIX, IMAGE_ROUTE_PREFIX } from '../prefix'

@Controller({
    path: IMAGE_ROUTE_PREFIX,
    docTitle: IMAGE_DOC_PREFIX,
})
export class FindImageController
    implements ControllerContract<[id: string], Image>
{
    constructor(
        @InjectRepository(Image) private imageRepo: Repository<Image>,
    ) {}
    @Get('one/:id')
    @ApiHeader({
        name: 'auth',
    })
    @UseGuards(UserGuard)
    async execute(@Param('id', ParseUUIDPipe) id: string): Promise<Image> {
        const image = await this.imageRepo.findOneBy({
            id,
        })
        if (!image) throw new NotFoundException()
        return image
    }
}
