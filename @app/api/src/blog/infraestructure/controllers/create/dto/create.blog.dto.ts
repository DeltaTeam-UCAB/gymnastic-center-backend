import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsDateString, IsString, MinLength } from 'class-validator'

export class CreateBlogDTO {
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
    trainer: string

    @ApiProperty()
    @IsString()
    @MinLength(1)
    category: string

    @ApiProperty()
    @IsDateString()
    date: Date
}
