import { IsString, IsUrl, MaxLength } from "class-validator";

export class RegisterServerDto {
    @IsUrl()
    url!: string;

    @IsString()
    @MaxLength(100)
    username!: string;

    @IsString()
    @MaxLength(50)
    password!: string;
}