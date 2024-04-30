import { ApiProperty } from '@nestjs/swagger'

export class UploadVideoDTO {
    @ApiProperty({ type: 'string', format: 'binary', required: true })
    video: Express.Multer.File
}
