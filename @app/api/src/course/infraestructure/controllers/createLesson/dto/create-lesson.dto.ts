import { ApiProperty } from '@nestjs/swagger'
import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator'

export class CreateLessonDTO {
    @ApiProperty()
    @IsString()
    name: string
    @ApiProperty()
    @IsString()
    description: string
    @ApiProperty()
    @IsUUID()
    courseId: string
    @ApiProperty()
    @IsUUID()
    videoId: string
    @ApiProperty()
    @IsOptional()
    @IsNumber()
    order: number
    @ApiProperty()
    @IsOptional()
    @IsNumber()
    waitTime?: number
    @ApiProperty()
    @IsNumber()
    burnedCalories: number
}
