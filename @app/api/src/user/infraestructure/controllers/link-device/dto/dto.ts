import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class LinkDeviceDTO {
    @ApiProperty()
    @IsString()
        token: string
}
