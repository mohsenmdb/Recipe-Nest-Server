import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from './entities/user.entity';
import { Repository } from 'typeorm';
import { RegisterDto } from 'src/auth/dto/register.dto';

@Injectable()
export class UserService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  findAll = async () => {
    return await this.userRepository.find();
  }

  createUser = async (userDto: RegisterDto) => {
    const user = this.userRepository.create(userDto);
    const userEntity = await this.userRepository.save(user);
    return await this.findOneById(userEntity.id);
  }

  findOneById = async (id: number) => {
    return await this.userRepository.findOneBy({ id: id });
  }

  findOneByEmail = async (email: string) => {
    return await this.userRepository.findOne({ where: { email: email } });
  }

  findOneByEmailWithPassword = async (email: string) => {
    return await this.userRepository.findOne({
      where: { email: email }
      , select: ['id', 'first_name', 'last_name', 'email', 'password']
    });
  }
}
