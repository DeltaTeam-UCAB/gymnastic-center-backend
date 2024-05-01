import { ControllerContract } from 'src/core/infraestructure/controllers/controller-model/controller.contract'
import { Controller } from 'src/core/infraestructure/controllers/decorators/controller.module'
import { UploadVideoDTO } from './dto/video.dto'
import {
    Body,
    HttpException,
    Inject,
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
import { InjectRepository } from '@nestjs/typeorm'
import { Video } from '../../models/postgres/video'
import { Repository } from 'typeorm'
import { VIDEO_DOC_PREFIX, VIDEO_ROUTE_PREFIX } from '../prefix'
import { Roles, RolesGuard } from 'src/user/infraestructure/guards/roles.guard'

@Controller({
    path: VIDEO_ROUTE_PREFIX,
    docTitle: VIDEO_DOC_PREFIX,
})
export class UploadVideoController
    implements
        ControllerContract<
            [file: Express.Multer.File, body: UploadVideoDTO],
            {
                id: string
            }
        >
{
    constructor(
        @Inject(UUID_GEN_NATIVE) private idGen: IDGenerator<string>,
        @Inject(CLOUDINARY_VIDEO_STORAGE) private videoStorage: VideoStorage,
        @InjectRepository(Video) private videoRepo: Repository<Video>,
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
    ): Promise<{ id: string }> {
        const result = await this.videoStorage.save({
            path: file.path,
        })
        if (result.isError()) throw new HttpException('Failed to save', 400)
        const videoId = this.idGen.generate()
        await this.videoRepo.save({
            id: videoId,
            src: result.unwrap().url,
        })
        return {
            id: videoId,
        }
    }
}
