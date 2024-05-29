import { IsString, MaxLength } from "class-validator";

export class CredentialsDto {
    @IsString()
    @MaxLength(100)
    username!: string;
    
    @IsString()
    @MaxLength(50)
    password!: string;
}