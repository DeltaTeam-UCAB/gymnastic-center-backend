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
import { ApiConsumes } from '@nestjs/swagger'
import { FileInterceptor } from '@nestjs/platform-express'
import { configVideoMulter } from '../../helpers/multer.helper'
import { UUID_GEN_NATIVE } from 'src/core/infraestructure/UUID/module/UUID.module'
import { IDGenerator } from 'src/core/application/ID/ID.generator'
import { VideoStorage } from 'src/core/application/storage/video/video.manager'
import { CLOUDINARY_VIDEO_STORAGE } from 'src/core/infraestructure/storage/video/video.storage.module'
import { VIDEO_DOC_PREFIX, VIDEO_ROUTE_PREFIX } from '../prefix'
import { rmSync } from 'fs'
import { VideoPostgresRepository } from '../../repositories/postgres/video.repository'
import { ErrorDecorator } from 'src/core/application/decorators/error.handler.decorator'
import { SaveVideoCommand } from 'src/video/application/commands/save/save.video.command'
import { SaveVideoResponse } from 'src/video/application/commands/save/types/response'
import { AuditDecorator } from 'src/core/application/decorators/audit.decorator'
import { AuditingTxtRepository } from 'src/core/infraestructure/auditing/repositories/txt/auditing.repository'
import { User as UserDecorator } from '../../decorators/user.decorator'
import { CurrentUserResponse } from '../../auth/current/types/response'
import { Roles, RolesGuard } from '../../guards/roles.guard'
import { UserGuard } from '../../guards/user.guard'

@Controller({
    path: VIDEO_ROUTE_PREFIX,
    docTitle: VIDEO_DOC_PREFIX,
    bearerAuth: true,
})
export class UploadVideoController
implements
        ControllerContract<
            [
                file: Express.Multer.File,
                body: UploadVideoDTO,
                user: CurrentUserResponse,
            ],
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
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('video', configVideoMulter))
    @UseGuards(UserGuard, RolesGuard)
    async execute(
        @UploadedFile() file: Express.Multer.File,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        @Body() _body: UploadVideoDTO,
        @UserDecorator() user: CurrentUserResponse,
    ): Promise<SaveVideoResponse> {
        try {
            const audit = {
                user: user.id,
                operation: 'Upload Video',
                succes: true,
                ocurredOn: new Date(Date.now()),
                data: JSON.stringify(_body),
            }

            const result = await new ErrorDecorator(
                new AuditDecorator(
                    new SaveVideoCommand(
                        this.idGen,
                        this.videoRepository,
                        this.videoStorage,
                    ),
                    new AuditingTxtRepository(),
                    audit,
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
