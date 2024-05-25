import { ApiProperty } from '@nestjs/swagger'
import { IsIn, IsString, IsUUID, MaxLength, MinLength } from 'class-validator'

export class CreateCommentDTO {
    @IsUUID()
    @ApiProperty()
    target: string
    @IsString()
    @IsIn(['BLOG', 'LESSON'])
    @ApiProperty()
    targetType: string
    @IsString()
    @MinLength(1)
    @MaxLength(200)
    @ApiProperty()
    body: string
}
