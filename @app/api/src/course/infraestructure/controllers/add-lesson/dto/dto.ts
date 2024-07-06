import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsUUID } from 'class-validator'

export class AddLessonDTO {
    @ApiProperty()
    @IsUUID()
        courseId: string
    @ApiProperty()
    @IsString()
        title: string
    @ApiProperty()
    @IsString()
        content: string
    @ApiProperty()
    @IsUUID()
        video: string
}
