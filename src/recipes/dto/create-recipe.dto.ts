import { Type } from "class-transformer";
import { ArrayNotEmpty, IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, MinLength } from "class-validator";
import UserGuards from "src/user/dto/userGuards";

export class CreateRecipeDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(10)
    description: string;
    
    @IsString()
    @IsNotEmpty()
    ingredients: string;

    @IsOptional()
    image: string;

    @IsOptional()
    @Type(() => UserGuards)
    user: UserGuards;
}
