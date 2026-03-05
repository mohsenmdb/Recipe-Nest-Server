import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { InjectRepository } from '@nestjs/typeorm';
import Recipe from './entities/recipe.entity';
import { ILike, Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import UserGuards from 'src/user/dto/userGuards';

@Injectable()
export class RecipesService {

  constructor(
    @InjectRepository(Recipe)
    private readonly recipeRepository: Repository<Recipe>,
    private readonly userService: UserService,
  ) { }

  async create(createRecipeDto: CreateRecipeDto) {
    return await this.recipeRepository.save(createRecipeDto);
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
      { title: ILike(`%${query}%`) },
      { description: ILike(`%${query}%`) },
      { ingredients: ILike(`%${query}%`) }
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

  async categories() {
    const slider = await this.fetchQuery('SLIDER')
    const milk = await this.fetchQuery('MILK')
    const beef = await this.fetchQuery('BEEF')
    const pasta = await this.fetchQuery('PASTA')
    const water = await this.fetchQuery('WATER')
    return [slider, milk, pasta, beef, water];
  }
async fetchQuery(query: string, pageSize: number = 5) {
  const where =
    query === 'SLIDER'
      ? undefined
      : [
          { title: ILike(`%${query.toLowerCase()}%`) },
          { description: ILike(`%${query.toLowerCase()}%`) },
          { ingredients: ILike(`%${query.toLowerCase()}%`) }
        ];

  const [items] = await this.recipeRepository.findAndCount({
    ...(where && { where }),
    take: pageSize,
    order: { id: 'DESC' }
  });

  return {
    type: query === 'SLIDER' ? 'SLIDER' : 'ROW',
    category: query === 'SLIDER' ? 'ALL' : query,
    recipes: items.map(recipe => this.withImagePath(recipe))
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
    const product = await this.recipeRepository.update(
      { id, user: updateRecipeDto?.user },
      {
        title: updateRecipeDto.title,
        description: updateRecipeDto.description,
        ingredients: updateRecipeDto.ingredients,
        image: updateRecipeDto.image,
        updatedAt: Math.floor(Date.now() / 1000)
      }
    );
    if (product.affected === 0) {
      throw new HttpException('Product not found', 404);
    }
    return product;
  }

  async remove(id: number, user: UserGuards) {
    const checkedRecipe = await this.recipeRepository.findOne({ where: { id, user } });
    if (!checkedRecipe) {
      throw new HttpException('Recipe not found or you are not authorized to update this recipe', 404);
    }
    return await this.recipeRepository.delete(id);
  }
}
