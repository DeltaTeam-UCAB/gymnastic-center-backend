import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

export class DislikeCommentDTO{

    @ApiProperty()
    @IsUUID()
    idComment: string

}