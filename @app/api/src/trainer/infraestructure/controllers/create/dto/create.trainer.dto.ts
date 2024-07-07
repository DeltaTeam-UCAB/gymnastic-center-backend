import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsUUID, MinLength } from 'class-validator'

export class CreateTrainerDTO {
    @ApiProperty()
    @IsString()
    @MinLength(3)
        name: string
    @ApiProperty()
    @IsString()
        location: string
    @ApiProperty()
    @IsUUID()
        image: string
}
