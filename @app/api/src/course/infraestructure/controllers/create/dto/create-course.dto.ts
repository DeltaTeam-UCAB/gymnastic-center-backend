import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator'

export class CreateCourseDTO {
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
    @IsOptional()
    @IsUUID()
    video?: string
    @ApiProperty()
    @IsUUID()
    image: string
}
