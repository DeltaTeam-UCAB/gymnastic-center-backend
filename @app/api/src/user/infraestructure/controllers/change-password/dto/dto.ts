import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString, Length, Matches } from 'class-validator'
import { passwordRegExp } from 'src/utils/regexps/password'

export class ChangePasswordDTO {
    @ApiProperty()
    @IsString()
    @Length(4)
    code: string
    @ApiProperty()
    @Matches(passwordRegExp)
    password: string
    @ApiProperty()
    @IsEmail()
    email: string
}
