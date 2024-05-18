import { ApiProperty } from '@nestjs/swagger'
import { IsEmail } from 'class-validator'

export class ForgetPasswordDTO {
    @ApiProperty()
    @IsEmail()
        email: string
}
