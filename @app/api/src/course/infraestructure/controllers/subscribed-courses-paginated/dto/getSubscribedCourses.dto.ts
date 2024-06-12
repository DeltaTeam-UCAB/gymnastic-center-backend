import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsPositive, IsUUID, Min } from 'class-validator'

export class GetSubscribedCoursesDTO {
    @ApiProperty()
    @Min(0)
    @Type(() => Number)
        page: number
    @ApiProperty()
    @IsPositive()
    @Type(() => Number)
        perPage: number
    @ApiProperty({})
    @IsUUID()
        client: string
}