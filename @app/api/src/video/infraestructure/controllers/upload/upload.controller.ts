import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { UploadVideoDTO } from './dto/video.dto'
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
import { configVideoMulter } from '../../helpers/multer.helper'
import { UUID_GEN_NATIVE } from 'src/core/infraestructure/UUID/module/UUID.module'
import { IDGenerator } from 'src/core/application/ID/ID.generator'
import { VideoStorage } from 'src/core/application/storage/video/video.manager'
import { CLOUDINARY_VIDEO_STORAGE } from 'src/core/infraestructure/storage/video/video.storage.module'
import { VIDEO_DOC_PREFIX, VIDEO_ROUTE_PREFIX } from '../prefix'
import { Roles, RolesGuard } from 'src/user/infraestructure/guards/roles.guard'
import { rmSync } from 'fs'
import { VideoPostgresRepository } from '../../repositories/postgres/video.repository'
import { ErrorDecorator } from 'src/core/application/decorators/error.handler.decorator'
import { SaveVideoCommand } from 'src/video/application/commands/save/save.video.command'
import { SaveVideoResponse } from 'src/video/application/commands/save/types/response'

@Controller({
    path: VIDEO_ROUTE_PREFIX,
    docTitle: VIDEO_DOC_PREFIX,
})
export class UploadVideoController
    implements
        ControllerContract<
            [file: Express.Multer.File, body: UploadVideoDTO],
            SaveVideoResponse
        >
{
    constructor(
        @Inject(UUID_GEN_NATIVE) private idGen: IDGenerator<string>,
        @Inject(CLOUDINARY_VIDEO_STORAGE) private videoStorage: VideoStorage,
        private videoRepository: VideoPostgresRepository,
    ) {}
    @Post('upload')
    @Roles('ADMIN')
    @ApiHeader({
        name: 'auth',
    })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('video', configVideoMulter))
    @UseGuards(UserGuard, RolesGuard)
    async execute(
        @UploadedFile() file: Express.Multer.File,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        @Body() _body: UploadVideoDTO,
    ): Promise<SaveVideoResponse> {
        try {
            const result = await new ErrorDecorator(
                new SaveVideoCommand(
                    this.idGen,
                    this.videoRepository,
                    this.videoStorage,
                ),
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
