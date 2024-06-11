import { Type } from 'class-transformer'
import { ApiProperty } from '@nestjs/swagger'
import {
    IsIn,
    IsOptional,
    IsPositive,
    IsString,
    IsUUID,
    Min,
} from 'class-validator'
import { FilterType } from 'src/blog/application/queries/getAll/types/dto'

export class GetAllCoursesDTO {
    @ApiProperty()
    @Min(0)
    @Type(() => Number)
        page: number
    @ApiProperty()
    @IsPositive()
    @Type(() => Number)
        perPage: number
    @ApiProperty()
    @IsString()
    @IsIn(['POPULAR', 'RECENT'])
        filter: FilterType
    @ApiProperty({
        required: false,
    })
    @IsUUID()
    @IsOptional()
        trainer?: string
    @ApiProperty({
        required: false,
    })
    @IsUUID()
    @IsOptional()
        category?: string
}
