import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsString } from 'class-validator'
import { Lesson } from 'src/course/infraestructure/models/postgres/lesson.entity'

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
    @IsString()
    image: string
    @ApiProperty()
    lessons: Lesson[]
}
