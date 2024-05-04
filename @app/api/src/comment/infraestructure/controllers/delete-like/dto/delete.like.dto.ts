import { ApiProperty } from '@nestjs/swagger'
import { IsUUID } from 'class-validator'

export class DeleteLikeDTO {
    @ApiProperty()
    @IsUUID()
    idComment: string
}
