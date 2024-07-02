import { ApiProperty } from '@nestjs/swagger'
import { IsInt, IsOptional, IsString, IsUUID } from 'class-validator'

export class CreateLessonDTO {
    @ApiProperty()
    @IsString()
    title: string
    @ApiProperty()
    @IsString()
    content: string
    @ApiProperty()
    @IsUUID()
    @IsOptional()
    image?: string
    @ApiProperty()
    @IsUUID()
    video: string
    @ApiProperty()
    @IsInt()
    order: number
}
