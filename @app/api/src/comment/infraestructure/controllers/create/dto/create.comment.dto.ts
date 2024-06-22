import { ApiProperty } from '@nestjs/swagger'
import { IsIn, IsString, IsUUID, MaxLength, MinLength } from 'class-validator'
import { TargetType } from 'src/comment/application/types/target-type'

export class CreateCommentDTO {
    @IsUUID()
    @ApiProperty()
    target: string
    @IsString()
    @IsIn(['BLOG', 'LESSON'])
    @ApiProperty()
    targetType: TargetType
    @IsString()
    @MinLength(1)
    @MaxLength(200)
    @ApiProperty()
    body: string
}
