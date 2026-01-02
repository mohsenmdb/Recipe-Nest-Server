import { HttpException, Injectable } from '@nestjs/common';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { InjectRepository } from '@nestjs/typeorm';
import Recipe from './entities/recipe.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RecipesService {

  constructor(
    @InjectRepository(Recipe)
    private readonly recipeRepository: Repository<Recipe>,
  ) { }

  async create(createRecipeDto: CreateRecipeDto) {
    const recipe = this.recipeRepository.create(createRecipeDto)
    return await this.recipeRepository.save(recipe);
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
