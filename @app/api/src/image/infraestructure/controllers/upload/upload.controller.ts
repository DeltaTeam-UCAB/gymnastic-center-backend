import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { UploadImageDTO } from './dto/image.dto'
import {
    Body,
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
import { Roles, RolesGuard } from 'src/user/infraestructure/guards/roles.guard'
import { ImageStorage } from 'src/core/application/storage/images/image.storage'
import { IMAGE_DOC_PREFIX, IMAGE_ROUTE_PREFIX } from '../prefix'
import { rmSync } from 'fs'
import { CLOUDINARY_IMAGE_STORAGE } from 'src/core/infraestructure/storage/image/image.storage.module'
import { SaveImageCommand } from 'src/image/application/commands/save/save.image.command'
import { ErrorDecorator } from 'src/core/application/decorators/error.handler.decorator'
import { ImagePostgresRepository } from '../../repositories/postgres/image.repository'
import { NestLogger } from 'src/core/infraestructure/logger/nest.logger'
import { LoggerDecorator } from 'src/core/application/decorators/logger.decorator'

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
        private imageRepository: ImagePostgresRepository,
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
            const commandBase = new SaveImageCommand(
                this.idGen,
                this.imageRepository,
                this.imageStorage,
            )

            const nestLogger = new NestLogger('Upload image logger')
            new LoggerDecorator(commandBase, nestLogger).execute({
                path: file.path,
            })

            const result = await new ErrorDecorator(
                commandBase,
                () => new InternalServerErrorException(),
            ).execute({
                path: file.path,
            })
            const data = result.unwrap()
            rmSync(file.path)
            return data
        } catch (e) {
            rmSync(file.path)
            throw new InternalServerErrorException()
        }
    }
}
