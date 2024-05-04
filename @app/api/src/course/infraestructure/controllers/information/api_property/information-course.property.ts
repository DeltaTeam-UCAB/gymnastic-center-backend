import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsString } from 'class-validator'

export class informationCourseProperty {
    @ApiProperty()
    @IsString()
    title: string
    @ApiProperty()
    @IsString()
    description: string
    @ApiProperty()
    @IsString()
    calories: number
    @ApiProperty()
    @IsString()
    instructor: string
    @ApiProperty()
    @IsNumber()
    category: string
    @ApiProperty()
    image: string
}
