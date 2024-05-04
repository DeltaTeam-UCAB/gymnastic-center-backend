/* eslint-disable indent */
import { IsNumber, IsString, IsUUID } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class InformationCourseDTO {
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
    @IsUUID()
    image: string
}
