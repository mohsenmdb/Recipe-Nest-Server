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
    const user = await this.userService.findOneByUsername(registerDto.username);
    if (user) {
      throw new HttpException('User with this username already exists', 422);
    }

    registerDto.password = bcrypt.hashSync(registerDto.password, 8);
    const userEntity = await this.userService.createUser(registerDto);
    if(userEntity === null) return

    const accessToken = this.jwtService.sign({ sub: userEntity.id, username: userEntity.username });
    return { user: userEntity, accessToken: accessToken };
  }

  async login(loginDto: LoginDto) {
    const user = await this.userService.findOneByUsernameWithPassword(loginDto.username);
    if (!user) {
      throw new HttpException('User not found', 401);
    }
    console.log(`User password: ${user.password}, Login password: ${loginDto.password}`);
    const isPasswordValid = bcrypt.compareSync(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new HttpException('Invalid password', 401);
    }

    const accessToken = this.jwtService.sign({ sub: user.id, username: user.username });
    return { accessToken: accessToken, user: user };
  }
}