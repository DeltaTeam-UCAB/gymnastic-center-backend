import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsIn, IsInt, IsString, IsUUID, Min } from 'class-validator'
import { CreateLessonDTO } from './create-lesson'
import { LEVELS } from 'src/course/domain/value-objects/course.level'

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
    @IsIn(['EASY', 'MEDIUM', 'HARD'])
    level: LEVELS
    @ApiProperty()
    @IsInt()
    @Min(0)
    weeks: number
    @ApiProperty()
    @IsInt()
    @Min(0)
    hours: number
    @ApiProperty({
        type: [CreateLessonDTO],
    })
    lessons: CreateLessonDTO[]
}
