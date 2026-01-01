import { Controller, Get, UseGuards, Request, HttpException } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import UserGuards from './dto/userGuards';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async profile(@Request() req: UserGuards) {
    const user = await this.userService.findOneById(req.id);
    if (!user) {
      throw new HttpException('User not found', 404);
    }
    return {user: user};
  }
}
