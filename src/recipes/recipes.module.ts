import { Module } from '@nestjs/common';
import { RecipesService } from './recipes.service';
import { RecipesController } from './recipes.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import Recipe from './entities/recipe.entity';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import User from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Recipe, User])],
  controllers: [RecipesController],
  providers: [RecipesService, UserService],
})
export class RecipesModule {}
