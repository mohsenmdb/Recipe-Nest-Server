import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { InjectRepository } from '@nestjs/typeorm';
import Recipe from './entities/recipe.entity';
import { Like, Repository } from 'typeorm';
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
  
  async findAllPaginated(page = 1, pageSize: number = 10, query: string) {
    const skip = (page - 1) * pageSize;
    const where = query ? [
      { title: Like(`%${query}%`) },
      { description: Like(`%${query}%`) },
      { ingredients: Like(`%${query}%`) }
    ] : {};

    const [items, total] = await this.recipeRepository.findAndCount({
      where,
      skip,
      take: pageSize,
      order: { id: 'DESC' }
    });

    const recipes = items.map(recipe => this.withImagePath(recipe));
    return {
      recipes: recipes,
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
    return this.withImagePath(recipe);
  }

  private withImagePath(entity: Recipe) {
    return {
      ...entity,
      image: entity.image
        ? `${process.env.UPLOADS_IMAGES_PATH}${entity.image}`
        : entity.image,
    };
  }

  async update(id: number, updateRecipeDto: UpdateRecipeDto) {
    const userId = updateRecipeDto?.user?.id;
    const product = await this.recipeRepository.update(
      { id, user_id: userId },
      {
        title: updateRecipeDto.title,
        description: updateRecipeDto.description,
        ingredients: updateRecipeDto.ingredients,
        image: updateRecipeDto.image,
      }
    );
    if (product.affected === 0) {
      throw new HttpException('Product not found', 404);
    }
    return product;
  }

  async remove(id: number, userId: number) {
    const checkedRecipe = await this.recipeRepository.findOne({ where: { id, user_id: userId } });
    if (!checkedRecipe) {
      throw new HttpException('Recipe not found or you are not authorized to update this recipe', 404);
    }
    return await this.recipeRepository.delete(id);
  }
}
