import { ApiProperty } from '@nestjs/swagger'
import { IsUUID, Length } from 'class-validator'

export class CreateCategoryDTO {
    @ApiProperty()
    @Length(4)
    name: string
    @ApiProperty()
    @IsUUID()
    icon: string
}
