import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  login(@Body() createAuthDto: RegisterDto) {
    return this.authService.register(createAuthDto);
  }
  @Post('/register')
  register(@Body() createAuthDto: RegisterDto) {
    return this.authService.login(createAuthDto);
  }
}
