import { HttpException, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserService } from 'src/user/user.service';
import bcrypt from 'node_modules/bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) { }

  async register(registerDto: RegisterDto) {
    const user = await this.userService.findOneByEmail(registerDto.email);
    if (user) {
      throw new HttpException('User with this email already exists', 400);
    }

    registerDto.password = bcrypt.hashSync(registerDto.password, 8);
    const userEntity = await this.userService.createUser(registerDto);
    return { user: userEntity };
  }

  async login(loginDto: LoginDto) {
    const user = await this.userService.findOneByEmailWithPassword(loginDto.email);
    if (!user) {
      throw new HttpException('User not found', 400);
    }
    console.log(`User password: ${user.password}, Login password: ${loginDto.password}`);
    const isPasswordValid = bcrypt.compareSync(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new HttpException('Invalid password', 400);
    }
    const accessToken = this.jwtService.sign({ sub: user.id, email: user.email });
    return { accessToken: accessToken };
  }
}