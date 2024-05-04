import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsOptional, IsPositive, Min } from 'class-validator'

export class PaginationDto {
    @ApiProperty({
        required: false,
    })
    @IsOptional()
    @IsPositive()
    @Type(() => Number)
    limit?: number
    @ApiProperty({
        required: false,
    })
    @IsOptional()
    @Min(0)
    @Type(() => Number)
    offset?: number
}
