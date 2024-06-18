import { ApiProperty } from '@nestjs/swagger'
import { IsBoolean, IsInt, IsUUID } from 'class-validator'

export class MarkEndDTO {
    @ApiProperty()
    @IsUUID()
    courseId: string
    @ApiProperty()
    @IsBoolean()
    markAsCompleted: boolean
    @ApiProperty()
    @IsUUID()
    lessonId: string
    @ApiProperty()
    @IsInt()
    time: number
    @ApiProperty()
    @IsInt()
        totalTime: number
}
