import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private usersRepo: Repository<User>) {}

  async findByEmail(email: string) {
    return this.usersRepo.findOne({ where: { email }});
  }

  async findById(id: string) {
    return this.usersRepo.findOne({ where: { id }});
  }

  async create(name: string, email: string, password: string) {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const user = this.usersRepo.create({ name, email, passwordHash });
    return this.usersRepo.save(user);
  }

  async comparePassword(plain: string, hashed: string) {
    return bcrypt.compare(plain, hashed);
  }
}
