import { Transform, Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsOptional, IsPositive, IsString, Min } from 'class-validator'

export class SearchDTO {
    @ApiProperty()
    @Min(0)
    @Type(() => Number)
    page: number
    @ApiProperty()
    @IsPositive()
    @Type(() => Number)
    perPage: number
    @ApiProperty({
        required: false,
    })
    @IsString()
    @IsOptional()
    term?: string
    @ApiProperty({ required: false, isArray: true })
    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    @Transform(({ value }) => (Array.isArray(value) ? value : value.split(',')))
        tag?: string[]
    @ApiProperty({
        required: false,
        type: 'string',
    })
    @Transform(({ value }) => (value ? JSON.parse(value) : undefined))
        tags?: string[]
}
