import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsInt, IsOptional, IsString, IsUUID, Min } from "class-validator";

export class SetClientInfoDTO {

    @ApiProperty()
    @IsUUID()
    id: string
    @ApiProperty()
    @IsInt()
    @Min(0)
    @IsOptional()
    weight?:number
    @ApiProperty()
    @IsInt()
    @Min(0)
    @IsOptional()
    height?:number
    @ApiProperty()
    @IsString()
    @IsOptional()
    location:string
    @ApiProperty()
    @IsString()
    @IsOptional()
    gender: 'F' | 'M' | 'X'
    @ApiProperty()
    @IsDateString()
    @IsOptional()
    birthdate: Date;

}