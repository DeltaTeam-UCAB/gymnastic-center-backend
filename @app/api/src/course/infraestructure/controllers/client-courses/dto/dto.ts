import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsPositive, Min } from 'class-validator'

export class GetClientCoursesDTO {
    @ApiProperty()
    @Min(1)
    @Type(() => Number)
    page: number
    @ApiProperty()
    @IsPositive()
    @Type(() => Number)
    perPage: number
}
