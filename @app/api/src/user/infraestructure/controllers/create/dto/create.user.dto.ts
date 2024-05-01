import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsIn, IsString, Length, Matches } from 'class-validator'
import { passwordRegExp } from 'src/utils/regexps/password'

const roles = ['CLIENT', 'ADMIN'] as const

export class CreateUserDTO {
    @ApiProperty()
    @IsEmail()
        email: string
    @ApiProperty()
    @Matches(passwordRegExp)
        password: string
    @ApiProperty()
    @IsString()
    @IsIn(roles)
        type: 'CLIENT' | 'ADMIN'
    @ApiProperty()
    @IsString()
    @Length(7)
        name: string
}
