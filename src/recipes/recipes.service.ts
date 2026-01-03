import { HttpException, Injectable } from '@nestjs/common';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { InjectRepository } from '@nestjs/typeorm';
import Recipe from './entities/recipe.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import e from 'express';

@Injectable()
export class RecipesService {

  constructor(
    @InjectRepository(Recipe)
    private readonly recipeRepository: Repository<Recipe>,
    private readonly userService: UserService,
  ) { }

  async create(createRecipeDto: CreateRecipeDto) {
    const userName = await this.getUserName(createRecipeDto?.user?.id);
    console.log(`userName = ${userName}`);
    const recipe = this.recipeRepository.create(createRecipeDto);
    return await this.recipeRepository.save(recipe);
  }

  async getUserName(userId: number) {
    if (userId) {
      const user = await this.userService.findOneById(userId);
      if (!user) throw new HttpException('User not found', 404);
      return user.first_name + '.' + user.last_name;
    } else {
      throw new HttpException('Authentication Error', 400);
    }
  }

  findAll() {
    return `This action returns all recipes`;
  }

  findOne(id: number) {
    return `This action returns a #${id} recipe`;
  }

  update(id: number, updateRecipeDto: UpdateRecipeDto) {
    return `This action updates a #${id} recipe`;
  }

  remove(id: number) {
    return `This action removes a #${id} recipe`;
  }
}
