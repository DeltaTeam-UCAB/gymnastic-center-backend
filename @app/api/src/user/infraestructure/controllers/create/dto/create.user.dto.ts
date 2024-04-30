import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsString, Length, Matches } from 'class-validator'
import { passwordRegExp } from 'src/utils/regexps/password'

export class CreateUserDTO {
    @ApiProperty()
    @IsEmail()
    email: string
    @ApiProperty()
    @Matches(passwordRegExp)
    password: string
    @ApiProperty()
    @IsString()
    type: 'CLIENT' | 'ADMIN'
    @ApiProperty()
    @IsString()
    @Length(7)
    name: string
}
