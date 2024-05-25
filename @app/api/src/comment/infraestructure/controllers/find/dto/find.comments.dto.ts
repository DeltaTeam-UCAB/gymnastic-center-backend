import { Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsPositive, IsUUID, Min } from 'class-validator'

export class FindCommentsDTO {
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
    @IsUUID()
    @IsOptional()
    blog?: string
    @ApiProperty({
        required: false,
    })
    @IsUUID()
    @IsOptional()
    lesson?: string
}
