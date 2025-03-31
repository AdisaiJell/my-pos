import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = new User();
    user.email = createUserDto.email;
    user.branch = JSON.parse(createUserDto.branch);
    user.salaryRate = parseFloat(createUserDto.salaryRate);
    const saltOrRounds = 10;
    user.password = await bcrypt.hash(createUserDto.password, saltOrRounds);

    user.fullName = createUserDto.fullName;
    user.gender = createUserDto.gender;
    user.role = JSON.parse(createUserDto.role);
    if (createUserDto.image && createUserDto.image !== '') {
      user.image = createUserDto.image;
    }
    return this.usersRepository.save(user);
  }

  async changePassword(email: string, oldPass: string, newPass: string) {
    const user = await this.findOneByEmail(email);
    const isMatch = await bcrypt.compare(oldPass, user?.password);
    if (isMatch) {
      const saltOrRounds = 10;
      user.password = await bcrypt.hash(newPass, saltOrRounds);
      this.usersRepository.save(user);
      return this.findOneByEmail(email);
    } else {
      return null;
    }
  }

  findAll() {
    return this.usersRepository.find({
      relations: { role: true, branch: true },
    });
  }

  async findAllByUser(userId: number) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      relations: { role: true, branch: true },
    });
    if (user.role.id === 1) {
      return this.usersRepository.find({
        where: { branch: { id: user.branch.id } },
        relations: { role: true, branch: true },
      });
    } else {
      return this.usersRepository.find({
        relations: { role: true, branch: true },
      });
    }
  }

  findOne(id: number) {
    return this.usersRepository.findOne({
      where: { id },
      relations: { role: true, branch: true },
    });
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOneOrFail({
      select: {
        id: true,
        fullName: true,
        email: true,
        password: true,
        gender: true,
        image: true,
        branch: { id: true, name: true, created: true, updated: true },
        role: { id: true, name: true, created: true, updated: true },
      },
      where: { email },
      relations: { role: true, branch: true },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOneOrFail({
      where: { id },
      relations: { role: true },
    });
    user.email = updateUserDto.email;
    if (updateUserDto.password !== 'undefined') {
      const saltOrRounds = 10;
      user.password = await bcrypt.hash(updateUserDto.password, saltOrRounds);
    }
    user.fullName = updateUserDto.fullName;
    user.gender = updateUserDto.gender;
    user.role = JSON.parse(updateUserDto.role);
    if (updateUserDto.branch) {
      user.branch = JSON.parse(updateUserDto.branch);
    }
    if (updateUserDto.salaryRate) {
      user.salaryRate = parseFloat(updateUserDto.salaryRate);
    }
    if (updateUserDto.image && updateUserDto.image !== '') {
      user.image = updateUserDto.image;
    }
    await this.usersRepository.save(user);
    return this.usersRepository.findOne({
      where: { id },
      relations: { role: true },
    });
  }

  async remove(id: number) {
    const removedUser = await this.usersRepository.findOneByOrFail({ id });
    return this.usersRepository.remove(removedUser);
  }
}
