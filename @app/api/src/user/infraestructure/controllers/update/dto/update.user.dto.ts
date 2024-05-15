import { ApiProperty } from '@nestjs/swagger'
import {
    IsEmail,
    IsOptional,
    IsString,
    Length,
    Matches,
    IsPhoneNumber,
} from 'class-validator'
import { passwordRegExp } from 'src/utils/regexps/password'

export class UpdateUserDTO {
    @ApiProperty()
    @IsEmail()
    @IsOptional()
    email?: string
    @ApiProperty()
    @Matches(passwordRegExp)
    @IsOptional()
    password?: string
    @ApiProperty()
    @IsString()
    @Length(7)
    @IsOptional()
    name?: string
    @ApiProperty()
    @IsPhoneNumber()
    @IsOptional()
    phone: string
}
