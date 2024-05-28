import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsString, IsUUID } from 'class-validator'
import { CreateLessonDTO } from './create-lesson'

export class CreateCourseDTO {
    @ApiProperty()
    @IsString()
    title: string
    @ApiProperty()
    @IsString()
    description: string
    @ApiProperty()
    @IsString()
    trainer: string
    @ApiProperty()
    @IsString()
    category: string
    @ApiProperty()
    @IsUUID()
    image: string
    @ApiProperty()
    @IsArray()
    tags: string[]
    @ApiProperty()
    @IsString()
    level: string
    @ApiProperty({
        type: [CreateLessonDTO],
    })
    lessons: CreateLessonDTO[]
}
