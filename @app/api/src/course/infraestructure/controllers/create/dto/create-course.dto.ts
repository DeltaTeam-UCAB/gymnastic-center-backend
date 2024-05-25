import { ApiProperty } from '@nestjs/swagger'
import {
    IsDateString,
    IsNumber,
    IsOptional,
    IsString,
    IsUUID,
} from 'class-validator'

export class CreateCourseDTO {
    @ApiProperty()
    @IsString()
    title: string
    @ApiProperty()
    @IsString()
    description: string
    @ApiProperty()
    @IsNumber()
    calories: number
    @ApiProperty()
    @IsString()
    instructor: string
    @ApiProperty()
    @IsString()
    category: string
    @ApiProperty()
    @IsDateString()
    creationDate: Date
    @ApiProperty()
    @IsOptional()
    @IsUUID()
    videoId?: string
    @ApiProperty()
    @IsUUID()
    imageId: string
}
