import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { UploadImageDTO } from './dto/image.dto'
import {
    Body,
    HttpException,
    Inject,
    InternalServerErrorException,
    Post,
    UploadedFile,
    UseGuards,
    UseInterceptors,
} from '@nestjs/common'
import { ApiConsumes, ApiHeader } from '@nestjs/swagger'
import { FileInterceptor } from '@nestjs/platform-express'
import { UserGuard } from 'src/user/infraestructure/guards/user.guard'
import { configImageMulter } from '../../helpers/multer.helper'
import { UUID_GEN_NATIVE } from 'src/core/infraestructure/UUID/module/UUID.module'
import { IDGenerator } from 'src/core/application/ID/ID.generator'
import { Repository } from 'typeorm'
import { Roles, RolesGuard } from 'src/user/infraestructure/guards/roles.guard'
import { Image } from '../../models/postgres/image'
import { ImageStorage } from 'src/core/application/storage/images/image.storage'
import { IMAGE_DOC_PREFIX, IMAGE_ROUTE_PREFIX } from '../prefix'
import { InjectRepository } from '@nestjs/typeorm'
import { rmSync } from 'fs'
import { CLOUDINARY_IMAGE_STORAGE } from 'src/core/infraestructure/storage/image/image.storage.module'

@Controller({
    path: IMAGE_ROUTE_PREFIX,
    docTitle: IMAGE_DOC_PREFIX,
})
export class UploadImageController
    implements
        ControllerContract<
            [file: Express.Multer.File, body: UploadImageDTO],
            {
                id: string
            }
        >
{
    constructor(
        @Inject(UUID_GEN_NATIVE) private idGen: IDGenerator<string>,
        @Inject(CLOUDINARY_IMAGE_STORAGE) private imageStorage: ImageStorage,
        @InjectRepository(Image) private imageRepo: Repository<Image>,
    ) {}
    @Post('upload')
    @Roles('ADMIN')
    @ApiHeader({
        name: 'auth',
    })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('image', configImageMulter))
    @UseGuards(UserGuard, RolesGuard)
    async execute(
        @UploadedFile() file: Express.Multer.File,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        @Body() _body: UploadImageDTO,
    ): Promise<{ id: string }> {
        try {
            const result = await this.imageStorage.save({
                path: file.path,
            })
            rmSync(file.path)
            if (result.isError()) throw new HttpException('Failed to save', 400)
            const imageId = this.idGen.generate()
            await this.imageRepo.save({
                id: imageId,
                src: result.unwrap().url,
            })
            return {
                id: imageId,
            }
        } catch (e) {
            rmSync(file.path)
            throw new InternalServerErrorException()
        }
    }
}
