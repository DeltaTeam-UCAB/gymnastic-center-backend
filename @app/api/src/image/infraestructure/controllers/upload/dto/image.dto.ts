import { ApiProperty } from '@nestjs/swagger'

export class UploadImageDTO {
    @ApiProperty({ type: 'string', format: 'binary', required: true })
    image: Express.Multer.File
}
