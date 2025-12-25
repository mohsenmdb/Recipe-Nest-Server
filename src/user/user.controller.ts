import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt-auth.guard';
import UserGuards from './dto/userGuards';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  findOne(@Request() req) {
    const user: UserGuards = req.user;
    return user
    // return this.userService.findOneById(2);
  }
}
