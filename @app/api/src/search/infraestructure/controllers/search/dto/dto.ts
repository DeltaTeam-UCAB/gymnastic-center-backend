import { Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsPositive, IsString, Min } from 'class-validator'

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
    @ApiProperty({
        required: false,
        type: 'string',
    })
    @Type(() => JSON.parse)
    tags?: string[]
}
