import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

export class LikeCommentDTO{

    @ApiProperty()
    @IsUUID()
    idComment: string

}