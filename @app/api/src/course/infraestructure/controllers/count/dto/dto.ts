import { ApiProperty } from '@nestjs/swagger'
import { IsOptional, IsUUID } from 'class-validator'

export class CountCoursesDTO {
    @ApiProperty({
        required: false,
    })
    @IsUUID()
    @IsOptional()
    category?: string
    @ApiProperty({
        required: false,
    })
    @IsUUID()
    @IsOptional()
    trainer?: string
}
