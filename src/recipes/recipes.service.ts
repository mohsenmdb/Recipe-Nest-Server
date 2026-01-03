import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { InjectRepository } from '@nestjs/typeorm';
import Recipe from './entities/recipe.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';

@Injectable()
export class RecipesService {

  constructor(
    @InjectRepository(Recipe)
    private readonly recipeRepository: Repository<Recipe>,
    private readonly userService: UserService,
  ) { }

  async create(createRecipeDto: CreateRecipeDto) {
    const userId = createRecipeDto?.user?.id;
    const userName = await this.getUserName(userId);
    console.log(`userName = ${userName}, userId = ${userId}`);

    const recipe = this.recipeRepository.create({
      title: createRecipeDto.title,
      description: createRecipeDto.description,
      ingredients: createRecipeDto.ingredients,
      image: createRecipeDto.image,
      user_id: userId,
      user_name: userName,
    });

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

  async findAllPaginated(page = 1, pageSize = 10) {
    const skip = (page - 1) * pageSize;

    const [items, total] = await this.recipeRepository.findAndCount({
      skip,
      take: pageSize,
      order: { id: 'DESC' },
    });

    return {
      items: items,
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  async findOne(id: number) {
    const recipe = await this.recipeRepository.findOne({ where: { id } });

    if (!recipe) {
      throw new NotFoundException(`Recipe with id ${id} not found`);
    }
    return recipe;
  }

  update(id: number, updateRecipeDto: UpdateRecipeDto) {
    return `This action updates a #${id} recipe`;
  }

  remove(id: number) {
    return `This action removes a #${id} recipe`;
  }
}
