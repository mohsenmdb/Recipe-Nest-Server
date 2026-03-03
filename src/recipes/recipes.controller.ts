import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UseInterceptors, UploadedFile, Request, Query, Put } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import UserGuards from 'src/user/dto/userGuards';
import { UserReq } from 'src/auth/jwt/jwt.user';

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) { }

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/recipes',
        filename: (req, file, cb) => {
          const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueName + extname(file.originalname));
        },
      }),
    }),
  )
  create(
    @Body() createRecipeDto: CreateRecipeDto,
    @UploadedFile() file: Express.Multer.File,
    @UserReq() req: UserGuards
  ) {
    createRecipeDto.user = req;
    createRecipeDto.image = file?.filename;
    return this.recipesService.create(createRecipeDto);
  }

  @Get()
  findAll(
    @Query('page') page = '1',
    @Query('pageSize') pageSize = '10',
    @Query('query') query: string,
  ) {
    return this.recipesService.findAllPaginated(+page, +pageSize, query);
  }

  @Get('/one/:id')
  findOne(@Param('id') id: string) {
    return this.recipesService.findOne(+id);
  }

  @Get('/categories')
  categories() {
    return this.recipesService.categories();
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/recipes',
        filename: (req, file, cb) => {
          const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, uniqueName + extname(file.originalname));
        },
      }),
    }),
  )
  update(
    @Param('id') id: string,
    @Body() updateRecipeDto: UpdateRecipeDto,
    @UploadedFile() file: Express.Multer.File,
    @UserReq() req: UserGuards
  ) {
    updateRecipeDto.user = req;
    updateRecipeDto.image = file?.filename;
    return this.recipesService.update(+id, updateRecipeDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @UserReq() req: UserGuards) {
    return this.recipesService.remove(+id, req);
  }
}
