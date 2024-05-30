import { IsString, MaxLength } from "class-validator";

export class RegisterServerDto {
    @IsString()
    url!: string;

    @IsString()
    @MaxLength(100)
    username!: string;

    @IsString()
    @MaxLength(50)
    password!: string;
}