import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsOptional, IsString } from 'class-validator'

export class ForgetPasswordDTO {
    @ApiProperty()
    @IsEmail()
    email: string
    @ApiProperty()
    @IsOptional()
    @IsString()
        token?: string
}
