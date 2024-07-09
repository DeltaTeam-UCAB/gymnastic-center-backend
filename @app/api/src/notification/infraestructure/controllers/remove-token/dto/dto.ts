import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'

export class RemoveTokenDTO {
    @ApiProperty()
    @IsString()
    token: string
}
