import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString, Length } from 'class-validator'

export class ValidateCodeDTO {
    @ApiProperty()
    @IsEmail()
        email: string
    @ApiProperty()
    @IsString()
    @Length(4)
        code: string
}
