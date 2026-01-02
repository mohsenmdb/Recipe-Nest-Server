import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";

export class RegisterDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    first_name: string;

    @IsNotEmpty()
    last_name: string;

    @IsOptional()
    age: number;
    
    @IsNotEmpty()
    password: string;
}