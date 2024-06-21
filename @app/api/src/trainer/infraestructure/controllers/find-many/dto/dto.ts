import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsBoolean, IsOptional, IsPositive, Min } from 'class-validator'

export class FindManyTrainersDTO {
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
    @IsOptional()
    @IsBoolean()
    @Type(() => Boolean)
    filterByFollowed: string
}
