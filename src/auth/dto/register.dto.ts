import { IsEmail, IsNotEmpty, IsOptional } from "class-validator";

export class RegisterDto {
    @IsNotEmpty()
    first_name: string;
    @IsNotEmpty()
    last_name: string;
    @IsEmail()
    email: string;
    @IsOptional()
    age: number;
    @IsNotEmpty()
    password: string;
}