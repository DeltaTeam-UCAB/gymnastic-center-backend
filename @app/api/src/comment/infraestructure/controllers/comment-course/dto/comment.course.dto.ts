import { ApiProperty } from "@nestjs/swagger"
import { IsString, IsUUID, MaxLength, MinLength } from "class-validator"

export class CommentCourseDTO {

    @ApiProperty()
    @IsUUID()
    idCourse: string
    @ApiProperty()
    @IsString()
    @MinLength(1)
    @MaxLength(200)
    description: string

}