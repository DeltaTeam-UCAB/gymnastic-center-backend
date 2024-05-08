import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsString, MinLength } from 'class-validator'

export class CreatePostDTO {
    @ApiProperty()
    @IsString()
    @MinLength(1)
    title: string

    @ApiProperty()
    @IsString()
    body: string

    @ApiProperty()
    @IsString({ each: true })
    images: string[]

    @ApiProperty()
    @IsString({ each: true })
    @IsArray()
    tags: string[]

    @ApiProperty()
    @IsString()
    @MinLength(1)
    autor: string
}
