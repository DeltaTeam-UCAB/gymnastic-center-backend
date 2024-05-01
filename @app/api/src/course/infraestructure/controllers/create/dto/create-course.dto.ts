import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsOptional, IsString } from 'class-validator'
import { Image } from 'src/image/infraestructure/models/postgres/image'
import { Video } from 'src/video/infraestructure/models/postgres/video'

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
    video: Video
    @ApiProperty()
    image: Image
}
